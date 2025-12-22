import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kord Legal - Brief Verification",
  description: "Automated legal brief verification and citation review",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
