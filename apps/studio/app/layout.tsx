import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thế Giới Số · Studio",
  description: "Vibe-code: chat trái, website hiện trên tên miền bên phải",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
