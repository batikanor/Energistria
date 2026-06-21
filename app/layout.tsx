import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energistria",
  description: "Satellite-driven solar persuasion intelligence for renewable installers."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
