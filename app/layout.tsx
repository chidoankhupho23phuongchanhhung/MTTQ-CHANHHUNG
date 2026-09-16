import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import FirebaseInit from "@/components/FirebaseInit";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "Mặt trận số thông minh - Phường Chánh Hưng",
  description: "Cổng thông tin Mặt trận số thông minh, phản ánh trực tuyến và hỗ trợ an sinh xã hội Phường Chánh Hưng, Quận 8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <FirebaseInit />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
