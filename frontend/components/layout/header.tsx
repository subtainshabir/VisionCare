"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { EyeIcon, ArrowRightIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Screening Tests", href: "/tests" },
    ...(isAuthenticated
      ? [
          { label: "History", href: "/history" },
          { label: "Settings", href: "/settings" },
        ]
      : []),
    { label: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="w-full bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Link */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-[#090D16] group"
          aria-label="VisionCare Home"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 dark:bg-cyan-500 flex items-center justify-center text-white dark:text-slate-950 shadow-md shadow-teal-600/20 dark:shadow-cyan-500/20 group-hover:bg-teal-500 dark:group-hover:bg-cyan-400 transition-colors">
            <EyeIcon size={20} className="text-white dark:text-slate-950" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              VisionCare
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 border border-teal-200 text-teal-800 dark:bg-cyan-950/70 dark:border-cyan-800/80 dark:text-cyan-300">
              Screening
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 ${
                    isActive
                      ? "text-teal-700 bg-teal-50 dark:text-cyan-300 dark:bg-cyan-950/60 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/settings"
                  className="text-xs text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-cyan-300 font-medium transition-colors"
                  title="Account Settings"
                >
                  {user?.displayName}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="text-xs px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            <Link href="/tests">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-sm font-semibold">
                <span>Start Screening</span>
                <ArrowRightIcon size={14} />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <ThemeToggle />

          <Link href="/tests">
            <Button variant="primary" size="sm" className="text-xs px-3 py-1.5 font-semibold">
              Tests
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 pt-3 pb-5 space-y-3 shadow-2xl animate-in fade-in duration-150"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-800 dark:bg-cyan-950/70 dark:text-cyan-300 font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm">
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-cyan-300 transition-colors"
                >
                  Signed in as <strong>{user?.displayName}</strong>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Link href="/tests" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="primary" size="md" className="w-full justify-center font-bold">
                Start Vision Screening
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
