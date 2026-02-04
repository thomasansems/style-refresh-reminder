"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f8f8; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .cta { display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>We Miss You!</h1>
  </div>
  <div class="content">
    <p>Hi there,</p>
    <p>It's been a while since you explored new styles for your home. We've added some amazing new designs that we think you'll love!</p>
    <p>Come back and discover:</p>
    <ul>
      <li>Fresh seasonal collections</li>
      <li>Trending color palettes</li>
      <li>New room inspiration</li>
    </ul>
    <p style="text-align: center; margin-top: 30px;">
      <a href="{{app_url}}" class="cta">Explore New Styles</a>
    </p>
  </div>
  <div class="footer">
    <p>You're receiving this email because you signed up for Home Decor app.</p>
    <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
  </div>
</body>
</html>`;

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "We miss you! Come see what's new",
    content: defaultContent,
    targetDays: "60",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          targetDays: parseInt(formData.targetDays),
        }),
      });

      if (!response.ok) throw new Error("Failed to create campaign");

      const campaign = await response.json();
      router.push(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                placeholder="e.g., Q1 Re-engagement"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., We miss you! Come see what's new"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
              />
            </div>

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
              <p className="text-sm text-muted-foreground">
                Users who haven&apos;t been active for this many days will be
                targeted.
              </p>
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
              required
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Use {"{{app_url}}"} and {"{{unsubscribe_url}}"} as placeholders.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/campaigns">Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  );
}
