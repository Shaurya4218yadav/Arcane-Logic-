import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VayuGuard | AI Income Stabilization",
  description: "Dynamic Earnings Floor and Zero-Touch Claims for Gig Workers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 font-sans`}>
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
             {children}
          </div>
        </main>
      </body>
    </html>
  );
}
