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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let darkMode = localStorage.getItem('dark-mode');
                if (darkMode) {
                  darkMode = JSON.parse(darkMode);
                  if (darkMode.state && darkMode.state.darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthStateListener />
        {children}
      </body>
    </html>
  );
}
