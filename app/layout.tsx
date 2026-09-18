import type { Metadata } from "next";
import { IBM_Plex_Sans, Literata } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const displayFont = Literata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Website Name",
  description: "Website description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
