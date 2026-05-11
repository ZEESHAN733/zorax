import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZORAX - AI Assistant",
  description: "Your advanced AI assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}