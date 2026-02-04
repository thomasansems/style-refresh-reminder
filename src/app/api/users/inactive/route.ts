import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { subDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "60");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const cutoffDate = subDays(new Date(), days);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { lastActiveAt: { lt: cutoffDate } },
        orderBy: { lastActiveAt: "asc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          name: true,
          lastActiveAt: true,
          pushToken: true,
        },
      }),
      prisma.user.count({
        where: { lastActiveAt: { lt: cutoffDate } },
      }),
    ]);

    return NextResponse.json({
      users,
      total,
      limit,
      offset,
      targetDays: days,
    });
  } catch (error) {
    console.error("Error fetching inactive users:", error);
    return NextResponse.json(
      { error: "Failed to fetch inactive users" },
      { status: 500 }
    );
  }
}
