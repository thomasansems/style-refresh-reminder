import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Style Refresh Reminder",
  description: "Re-engagement campaign tool for Home Decor app users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-background">
          <nav className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <a href="/dashboard" className="text-xl font-semibold">
                  Style Refresh Reminder
                </a>
                <div className="flex gap-4">
                  <a href="/dashboard" className="text-sm hover:underline">
                    Dashboard
                  </a>
                  <a href="/campaigns" className="text-sm hover:underline">
                    Campaigns
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
