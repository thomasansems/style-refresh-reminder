import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subDays } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, channel = "EMAIL" } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const cutoffDate = subDays(new Date(), campaign.targetDays);

    // Get inactive users who haven't received this campaign yet
    const inactiveUsers = await prisma.user.findMany({
      where: {
        lastActiveAt: { lt: cutoffDate },
        NOT: {
          notifications: {
            some: { campaignId },
          },
        },
      },
    });

    if (inactiveUsers.length === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
        message: "No eligible users found",
      });
    }

    // Create notification records (simulating email send)
    const notifications = await prisma.notification.createMany({
      data: inactiveUsers.map((user) => ({
        userId: user.id,
        campaignId,
        channel,
        sentAt: new Date(),
      })),
    });

    // Update campaign status to ACTIVE if it was DRAFT
    if (campaign.status === "DRAFT") {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "ACTIVE" },
      });
    }

    // In a real app, you would integrate with an email service here
    // e.g., SendGrid, AWS SES, Resend, etc.
    console.log(
      `[Campaign ${campaignId}] Sent to ${inactiveUsers.length} users`
    );
    inactiveUsers.forEach((user) => {
      console.log(`  - ${user.email}: ${campaign.subject}`);
    });

    return NextResponse.json({
      success: true,
      sentCount: notifications.count,
      message: `Campaign sent to ${notifications.count} users`,
    });
  } catch (error) {
    console.error("Error sending campaign:", error);
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}
