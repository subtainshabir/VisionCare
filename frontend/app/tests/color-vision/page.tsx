import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { ColorVisionSession } from "@/components/screening/color-vision-session";
import { ScreeningNotice } from "@/components/screening/screening-notice";

export const metadata: Metadata = {
  title: "Color Vision Screening - VisionCare",
  description:
    "An educational browser-based color vision screening session presenting 5 randomized pseudoisochromatic plates from our 100+ plate question bank.",
};

export default function ColorVisionPage() {
  return (
    <main className="flex-1 py-10 sm:py-16 bg-slate-50 dark:bg-[#090D16] transition-colors">
      <PageContainer maxWidth="xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <li>
              <Link
                href="/"
                className="hover:text-teal-600 dark:hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xs"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400 dark:text-slate-600">
              /
            </li>
            <li>
              <Link
                href="/tests"
                className="hover:text-teal-600 dark:hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xs"
              >
                Screening Tests
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400 dark:text-slate-600">
              /
            </li>
            <li aria-current="page" className="text-teal-700 dark:text-cyan-400 font-semibold">
              Color Vision Screening
            </li>
          </ol>
        </nav>

        {/* Clear Demonstration Identification Banner */}
        <div className="mb-8 p-4 rounded-2xl border border-teal-200 dark:border-teal-500/20 bg-white dark:bg-[#0F172A]/90 text-slate-700 dark:text-slate-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-cyan-400 animate-pulse" aria-hidden="true" />
            <div>
              <strong className="text-slate-900 dark:text-white font-bold block sm:inline">
                Color Vision Screening:{" "}
              </strong>
              <span className="text-slate-600 dark:text-slate-400">
                Randomized 5-plate educational screening from our 100+ plate bank across red-green and blue-yellow palettes.
              </span>
            </div>
          </div>
          <Badge variant="primary" className="shrink-0 text-[11px]">
            Educational Screening
          </Badge>
        </div>

        {/* Interactive Test Engine Session */}
        <div className="mb-14">
          <Suspense
            fallback={
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Loading screening session...
              </div>
            }
          >
            <ColorVisionSession />
          </Suspense>
        </div>

        {/* Clinical Responsible-Use Advisory */}
        <ScreeningNotice />
      </PageContainer>
    </main>
  );
}
