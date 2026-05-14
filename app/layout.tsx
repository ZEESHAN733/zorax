import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZORAX - AI Assistant",
  description: "Your advanced AI assistant powered by Groq",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2306b6d4' width='100' height='100' rx='20'/><text x='50' y='65' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>Z</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
