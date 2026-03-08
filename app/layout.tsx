import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "암호동아리 Hedgehog — Web Hacking CTF",
  description: "암호동아리 Hedgehog 동아리 박람회 웹해킹 CTF 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-black text-gray-300">{children}</body>
    </html>
  );
}
