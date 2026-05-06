import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import KeyboardShortcut from "@/components/KeyboardShortcut";

export const metadata: Metadata = {
  title: "정보보호 연구실",
  description: "정보보호 연구실",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <ThemeToggle />
          <KeyboardShortcut />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
