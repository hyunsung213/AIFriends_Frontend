import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-pretendard", // reusing the variable name from tailwind config
});

export const metadata: Metadata = {
  title: "AI 마음친구",
  description: "40~60대를 위한 음성 말벗 및 마음정리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script src="https://code.responsivevoice.org/responsivevoice.js?key=jPla5x6e" strategy="beforeInteractive" />
      </head>
      <body className={notoSansKR.variable}>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
