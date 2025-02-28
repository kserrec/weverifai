import type { Metadata } from "next";
import type { JSX } from "react";
import { AuthStateListener } from '@/components/AuthStateListener'
import { ThemeInitializer } from '@/components/ThemeInitializer'
import { ClientOnly } from '@/components/ClientOnly'
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
  title: "askLarge",
  description: "Trust, but VerifAI",
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'icon', url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', url: '/apple-icon.png', sizes: '180x180' }
    ]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            color-scheme: light;
          }
          :root.dark {
            color-scheme: dark;
          }
          /* Disable transitions by default */
          * {
            transition: none !important;
          }
          /* Enable transitions after initialization */
          html.theme-initialized * {
            transition: background-color 0.3s ease,
                      color 0.3s ease,
                      border-color 0.3s ease,
                      box-shadow 0.3s ease !important;
          }
        `}</style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientOnly>
          <ThemeInitializer />
          {children}
        </ClientOnly>
        <AuthStateListener />
      </body>
    </html>
  );
}
