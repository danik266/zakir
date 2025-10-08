import type { Metadata } from "next";
import { Geist, Open_Sans , Assistant} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar/Navbar";
import Need from "@/components/shared/Need/Need";
import Advant from "@/components/shared/Need/Need";
import Footer from "@/components/shared/Footer/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Заки́р",
  description: " это ваше личное, виртуальное место для поминания, доступное в любое время и из любой точки мира.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
