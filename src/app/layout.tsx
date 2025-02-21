import type { Metadata } from "next";
import type { JSX } from "react";
import { AuthStateListener } from '@/components/AuthStateListener'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeVerifAI",
  description: "Trust, but VerifAI",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthStateListener />
        {children}
      </body>
    </html>
  );
}
