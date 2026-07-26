import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://nexuschicago.com"),
  title: {
    default: "Nexus Chicago Realty Group | Chicago Real Estate",
    template: "%s | Nexus Chicago Realty Group",
  },
  description:
    "From click to close, Nexus is the crossroads of Chicago real estate. Full-time, experienced agents serving Chicago and the North Shore: buying, selling, REO, and new construction.",
  keywords: [
    "Chicago real estate",
    "Chicago homes for sale",
    "North Shore realtor",
    "River Forest real estate",
    "Nexus Chicago",
  ],
  openGraph: {
    title: "Nexus Chicago Realty Group",
    description:
      "From click to close, Nexus is the crossroads of Chicago real estate.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
