export const emailTemplates = {
  reEngagement: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f5f5f5; }
    .container { background: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content p { color: #374151; line-height: 1.6; margin: 0 0 16px 0; }
    .features { background: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0; }
    .features ul { margin: 0; padding-left: 20px; }
    .features li { color: #4b5563; margin-bottom: 12px; }
    .cta { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
    .cta:hover { opacity: 0.9; }
    .footer { padding: 24px 30px; text-align: center; background: #f9fafb; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 0 0 8px 0; }
    .footer a { color: #667eea; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>We Miss You!</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>It's been a while since you explored new styles for your home. We've been busy adding amazing new designs that we think you'll absolutely love!</p>
      <div class="features">
        <p style="font-weight: 600; margin-bottom: 16px; color: #111827;">What's new:</p>
        <ul>
          <li>Fresh seasonal collections for every room</li>
          <li>Trending color palettes for 2024</li>
          <li>New room inspiration galleries</li>
          <li>Exclusive deals on featured styles</li>
        </ul>
      </div>
      <p>Ready to refresh your space? Come back and discover what's waiting for you.</p>
      <p style="text-align: center;">
        <a href="{{app_url}}" class="cta">Explore New Styles</a>
      </p>
    </div>
    <div class="footer">
      <p>You're receiving this email because you signed up for Home Decor app.</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="{{preferences_url}}">Update preferences</a></p>
    </div>
  </div>
</body>
</html>`,

  newCollection: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f5f5f5; }
    .container { background: #ffffff; }
    .header { background: #1f2937; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
    .header p { color: #9ca3af; margin: 8px 0 0 0; }
    .content { padding: 40px 30px; }
    .content p { color: #374151; line-height: 1.6; margin: 0 0 16px 0; }
    .highlight { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin: 24px 0; }
    .highlight p { margin: 0; color: #92400e; }
    .cta { display: inline-block; background: #1f2937; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; margin-top: 16px; }
    .footer { padding: 24px 30px; text-align: center; background: #f9fafb; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 0 0 8px 0; }
    .footer a { color: #1f2937; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Collection</h1>
      <p>Curated just for you</p>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We noticed you haven't visited in a while, and we wanted to share something special with you.</p>
      <div class="highlight">
        <p><strong>Exclusive Preview:</strong> Our new Spring/Summer collection is now available, featuring minimalist designs and warm earth tones.</p>
      </div>
      <p>As a valued member of our community, you get early access to shop before everyone else.</p>
      <p style="text-align: center;">
        <a href="{{app_url}}" class="cta">View Collection</a>
      </p>
    </div>
    <div class="footer">
      <p>You're receiving this email because you signed up for Home Decor app.</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,

  styleQuiz: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f5f5f5; }
    .container { background: #ffffff; }
    .header { background: #059669; padding: 40px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content p { color: #374151; line-height: 1.6; margin: 0 0 16px 0; }
    .quiz-box { background: #ecfdf5; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
    .quiz-box h3 { color: #059669; margin: 0 0 12px 0; }
    .quiz-box p { color: #047857; margin: 0; }
    .cta { display: inline-block; background: #059669; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px; }
    .footer { padding: 24px 30px; text-align: center; background: #f9fafb; }
    .footer p { color: #9ca3af; font-size: 12px; margin: 0 0 8px 0; }
    .footer a { color: #059669; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Rediscover Your Style</h1>
    </div>
    <div class="content">
      <p>Hey there,</p>
      <p>Styles change. Tastes evolve. What felt right a few months ago might not be your vibe anymore—and that's totally okay!</p>
      <div class="quiz-box">
        <h3>Take Our Style Quiz</h3>
        <p>Answer 5 quick questions and get personalized recommendations tailored to your current taste.</p>
      </div>
      <p>Whether you're into cozy minimalism, bold maximalism, or something in between, we'll help you find pieces that feel like home.</p>
      <p style="text-align: center;">
        <a href="{{app_url}}/quiz" class="cta">Start Style Quiz</a>
      </p>
    </div>
    <div class="footer">
      <p>You're receiving this email because you signed up for Home Decor app.</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
};

export type EmailTemplateKey = keyof typeof emailTemplates;
