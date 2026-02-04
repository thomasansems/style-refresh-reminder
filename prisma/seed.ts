import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sample users with varying activity levels
  const users = await Promise.all([
    // Active users (within 30 days)
    prisma.user.create({
      data: {
        email: "active1@example.com",
        name: "Alice Active",
        lastActiveAt: subDays(new Date(), 5),
        preferences: JSON.stringify({ style: "minimalist", colors: ["white", "gray"] }),
      },
    }),
    prisma.user.create({
      data: {
        email: "active2@example.com",
        name: "Bob Recent",
        lastActiveAt: subDays(new Date(), 15),
        preferences: JSON.stringify({ style: "modern", colors: ["black", "gold"] }),
      },
    }),
    // Somewhat inactive users (30-60 days)
    prisma.user.create({
      data: {
        email: "somewhat1@example.com",
        name: "Carol Casual",
        lastActiveAt: subDays(new Date(), 45),
        preferences: JSON.stringify({ style: "bohemian", colors: ["earth tones"] }),
      },
    }),
    // Inactive users (60+ days) - target for re-engagement
    prisma.user.create({
      data: {
        email: "inactive1@example.com",
        name: "Diana Dormant",
        lastActiveAt: subDays(new Date(), 75),
        pushToken: "push_token_diana",
        preferences: JSON.stringify({ style: "scandinavian", colors: ["white", "wood"] }),
      },
    }),
    prisma.user.create({
      data: {
        email: "inactive2@example.com",
        name: "Eve Elsewhere",
        lastActiveAt: subDays(new Date(), 90),
        preferences: JSON.stringify({ style: "industrial", colors: ["metal", "brick"] }),
      },
    }),
    prisma.user.create({
      data: {
        email: "inactive3@example.com",
        name: "Frank Forgotten",
        lastActiveAt: subDays(new Date(), 120),
        pushToken: "push_token_frank",
        preferences: JSON.stringify({ style: "traditional", colors: ["navy", "cream"] }),
      },
    }),
    // Very inactive users (180+ days)
    prisma.user.create({
      data: {
        email: "veryold1@example.com",
        name: "Grace Gone",
        lastActiveAt: subDays(new Date(), 200),
        preferences: JSON.stringify({ style: "eclectic" }),
      },
    }),
    prisma.user.create({
      data: {
        email: "veryold2@example.com",
        name: "Henry History",
        lastActiveAt: subDays(new Date(), 365),
        preferences: null,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create sample campaigns
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        name: "Q1 Re-engagement",
        subject: "We miss you! Come see what's new",
        content: `<!DOCTYPE html>
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
  <div class="header"><h1>We Miss You!</h1></div>
  <div class="content">
    <p>Hi there,</p>
    <p>It's been a while since you explored new styles. We've added amazing new designs!</p>
    <p style="text-align: center;"><a href="{{app_url}}" class="cta">Explore New Styles</a></p>
  </div>
  <div class="footer"><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p></div>
</body>
</html>`,
        targetDays: 60,
        status: "COMPLETED",
      },
    }),
    prisma.campaign.create({
      data: {
        name: "Spring Collection Preview",
        subject: "Exclusive: Spring styles are here!",
        content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
    .header { background: #e8f5e9; padding: 30px; text-align: center; }
    .content { padding: 20px; }
    .cta { display: inline-block; background: #2e7d32; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header"><h1>Spring Has Arrived!</h1></div>
  <div class="content">
    <p>Fresh styles for a fresh season. Be the first to explore our new collection.</p>
    <p style="text-align: center;"><a href="{{app_url}}" class="cta">Shop Now</a></p>
  </div>
</body>
</html>`,
        targetDays: 90,
        status: "ACTIVE",
      },
    }),
    prisma.campaign.create({
      data: {
        name: "Style Quiz Reminder",
        subject: "Have your tastes changed? Take our quiz!",
        content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
    .header { background: #fff3e0; padding: 30px; text-align: center; }
    .content { padding: 20px; }
    .cta { display: inline-block; background: #ef6c00; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header"><h1>Rediscover Your Style</h1></div>
  <div class="content">
    <p>Styles evolve! Take our quick quiz to get personalized recommendations.</p>
    <p style="text-align: center;"><a href="{{app_url}}/quiz" class="cta">Start Quiz</a></p>
  </div>
</body>
</html>`,
        targetDays: 60,
        status: "DRAFT",
      },
    }),
  ]);

  console.log(`Created ${campaigns.length} campaigns`);

  // Create some notification history for the completed campaign
  const completedCampaign = campaigns[0];
  const inactiveUsers = users.filter((u) =>
    u.email.includes("inactive") || u.email.includes("veryold")
  );

  const notifications = await Promise.all(
    inactiveUsers.slice(0, 3).map((user, index) =>
      prisma.notification.create({
        data: {
          userId: user.id,
          campaignId: completedCampaign.id,
          channel: "EMAIL",
          sentAt: subDays(new Date(), 30),
          openedAt: index < 2 ? subDays(new Date(), 29) : null,
        },
      })
    )
  );

  console.log(`Created ${notifications.length} notification records`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
