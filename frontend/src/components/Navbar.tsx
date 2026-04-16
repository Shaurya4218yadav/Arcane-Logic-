"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();

  const getPath = (link: string) => {
    if (link === "Dashboard") return "/";
    if (link === "Disruption Impact") return "/disruption";
    if (link === "My Plan") return "/policy";
    if (link === "Claims") return "/claims";
    if (link === "History") return "/history";
    if (link === "Admin Command") return "/admin";
    return "/";
  };

  const isActive = (link: string) => {
    return pathname === getPath(link);
  };

  return (
    <nav className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              VayuGuard
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link}
                href={getPath(link)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link)
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Active Protection</span>
          </div>

          <Link
            href="/register"
            className="hidden sm:flex px-4 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden flex items-center gap-1 px-6 pb-3 overflow-x-auto">
        {NAV_LINKS.map((link) => (
          <Link
            key={link}
            href={getPath(link)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              isActive(link)
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {link}
          </Link>
        ))}
      </div>
    </nav>
  );
}
