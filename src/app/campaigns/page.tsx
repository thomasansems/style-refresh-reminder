export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";

async function getCampaigns() {
  return prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { notifications: true } },
    },
  });
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button asChild>
          <a href="/campaigns/new">Create Campaign</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="text-muted-foreground">
              No campaigns yet. Create your first campaign to start re-engaging
              users.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <a
                        href={`/campaigns/${campaign.id}`}
                        className="font-medium hover:underline"
                      >
                        {campaign.name}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {campaign.subject}
                    </TableCell>
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
                    <TableCell>{campaign.targetDays} days inactive</TableCell>
                    <TableCell>{campaign._count.notifications}</TableCell>
                    <TableCell>
                      {format(campaign.createdAt, "MMM d, yyyy")}
                    </TableCell>
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
