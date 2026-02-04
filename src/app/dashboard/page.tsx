export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { subDays } from "date-fns";

async function getStats() {
  const [
    totalUsers,
    inactiveUsers,
    totalCampaigns,
    activeCampaigns,
    totalNotifications,
    openedNotifications,
    recentCampaigns,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { lastActiveAt: { lt: subDays(new Date(), 60) } },
    }),
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: "ACTIVE" } }),
    prisma.notification.count(),
    prisma.notification.count({ where: { openedAt: { not: null } } }),
    prisma.campaign.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { notifications: true } } },
    }),
  ]);

  const openRate =
    totalNotifications > 0
      ? ((openedNotifications / totalNotifications) * 100).toFixed(1)
      : "0";

  return {
    totalUsers,
    inactiveUsers,
    totalCampaigns,
    activeCampaigns,
    totalNotifications,
    openRate,
    recentCampaigns,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive Users (60+ days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeCampaigns} / {stats.totalCampaigns}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalNotifications} notifications sent
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentCampaigns.length === 0 ? (
            <p className="text-muted-foreground">
              No campaigns yet.{" "}
              <a href="/campaigns/new" className="underline">
                Create your first campaign
              </a>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target Days</TableHead>
                  <TableHead>Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <a
                        href={`/campaigns/${campaign.id}`}
                        className="font-medium hover:underline"
                      >
                        {campaign.name}
                      </a>
                    </TableCell>
                    <TableCell>{campaign.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          campaign.status === "ACTIVE"
                            ? "default"
                            : campaign.status === "COMPLETED"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.targetDays} days</TableCell>
                    <TableCell>{campaign._count.notifications}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
