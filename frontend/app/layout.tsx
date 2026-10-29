import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "VisionCare - Digital Vision Screening",
  description:
    "Accessible browser-based vision screening demonstrations to test color perception, distance acuity, and close reading clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth dark">
      <body className="min-h-full flex flex-col bg-[#090D16] text-[#F8FAFC] antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
