"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { Campaign, Notification, User } from "@prisma/client";

type CampaignWithRelations = Campaign & {
  notifications: (Notification & { user: User })[];
  _count: { notifications: number };
  openedCount: number;
};

interface Props {
  campaign: CampaignWithRelations;
  eligibleUsersCount: number;
}

export function CampaignEditor({ campaign, eligibleUsersCount }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: campaign.name,
    subject: campaign.subject,
    content: campaign.content,
    targetDays: campaign.targetDays.toString(),
    status: campaign.status,
  });

  const openRate =
    campaign._count.notifications > 0
      ? ((campaign.openedCount / campaign._count.notifications) * 100).toFixed(
          1
        )
      : "0";

  async function handleSave() {
    setLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          targetDays: parseInt(formData.targetDays),
        }),
      });

      if (!response.ok) throw new Error("Failed to update campaign");
      router.refresh();
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Failed to update campaign");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (
      !confirm(
        `This will send emails to ${eligibleUsersCount} inactive users. Continue?`
      )
    ) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaign.id }),
      });

      if (!response.ok) throw new Error("Failed to send campaign");

      const result = await response.json();
      alert(`Campaign sent to ${result.sentCount} users!`);
      router.refresh();
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Failed to send campaign");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <div className="flex items-center gap-2">
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
            <span className="text-muted-foreground">
              Created {format(campaign.createdAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Preview</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Email Preview</DialogTitle>
              </DialogHeader>
              <div className="border rounded-lg p-4 bg-white">
                <div className="border-b pb-2 mb-4">
                  <p className="text-sm text-muted-foreground">Subject:</p>
                  <p className="font-medium">{formData.subject}</p>
                </div>
                <iframe
                  srcDoc={formData.content}
                  className="w-full h-[500px] border-0"
                  title="Email preview"
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSend} disabled={sending || eligibleUsersCount === 0}>
            {sending ? "Sending..." : `Send to ${eligibleUsersCount} Users`}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign._count.notifications}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Opened
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.openedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="history">
            Send History ({campaign._count.notifications})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetDays">Target Inactive Days</Label>
                  <Select
                    value={formData.targetDays}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetDays: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PAUSED">Paused</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Content (HTML)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" asChild>
              <a href="/campaigns">Back to Campaigns</a>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              {campaign.notifications.length === 0 ? (
                <p className="text-muted-foreground">
                  No notifications sent yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Opened At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.notifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>{notification.user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {notification.channel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(notification.sentAt, "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          {notification.openedAt
                            ? format(notification.openedAt, "MMM d, yyyy HH:mm")
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
