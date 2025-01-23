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

export const metadata = {
  title: "WeVerifAI",
  description: "Trust, but VerifAI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <nav>
            {/* Your navigation links here */}
            <a href="/">Home</a> | <a href="/landing">Landing</a>
          </nav>
        </header>

        <main>{children}</main> {/* This is where your page content will be rendered */}

        <footer>
          {/* Footer content here */}
          <p>&copy; 2025 WeVerifAI. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}