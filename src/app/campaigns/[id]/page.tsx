export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CampaignEditor } from "./campaign-editor";

interface Props {
  params: Promise<{ id: string }>;
}

async function getCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      notifications: {
        include: { user: true },
        orderBy: { sentAt: "desc" },
        take: 50,
      },
      _count: {
        select: { notifications: true },
      },
    },
  });

  if (!campaign) return null;

  const openedCount = await prisma.notification.count({
    where: { campaignId: id, openedAt: { not: null } },
  });

  return { ...campaign, openedCount };
}

async function getInactiveUsersCount(targetDays: number) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - targetDays);

  return prisma.user.count({
    where: { lastActiveAt: { lt: cutoffDate } },
  });
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    notFound();
  }

  const eligibleUsers = await getInactiveUsersCount(campaign.targetDays);

  return (
    <CampaignEditor campaign={campaign} eligibleUsersCount={eligibleUsers} />
  );
}
