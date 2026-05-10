import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZORAX - AI Assistant",
  description: "Your advanced AI assistant",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:rgb(59,130,246)'/><stop offset='100%' style='stop-color:rgb(147,51,234)'/></linearGradient></defs><rect width='100' height='100' rx='20' fill='url(%23g)'/><path d='M 30 30 L 50 70 L 70 30 M 50 70 L 50 85' stroke='white' stroke-width='8' stroke-linecap='round' fill='none'/></svg>",
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