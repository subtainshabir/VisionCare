import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { NearVisionSession } from "@/components/screening/near-vision-session";
import { ScreeningNotice } from "@/components/screening/screening-notice";

export const metadata: Metadata = {
  title: "Rosenbaum Near Vision Reading Chart - VisionCare",
  description:
    "An interactive Rosenbaum-style near vision reading chart with calibrated 14-inch (35 cm) viewing distance, progressive line sizing, and Jaeger / distance-equivalent screening.",
};

export default function NearVisionPage() {
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
              Rosenbaum Near Vision Chart
            </li>
          </ol>
        </nav>

        {/* Clear Demonstration Identification Banner */}
        <div className="mb-8 p-4 rounded-2xl border border-teal-200 dark:border-teal-500/20 bg-white dark:bg-[#0F172A]/90 text-slate-700 dark:text-slate-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-cyan-400 animate-pulse" aria-hidden="true" />
            <div>
              <strong className="text-slate-900 dark:text-white font-bold block sm:inline">
                Rosenbaum Near Vision Reading Screener:{" "}
              </strong>
              <span className="text-slate-600 dark:text-slate-400">
                Presents standardized Rosenbaum lines at calibrated 14-inch (35 cm) viewing distance. Educational screening demonstration only; does not diagnose presbyopia, hyperopia, or astigmatism.
              </span>
            </div>
          </div>
          <Badge variant="primary" className="shrink-0 text-[11px]">
            Educational Screener
          </Badge>
        </div>

        {/* Interactive Test Engine Session */}
        <div className="mb-14">
          <NearVisionSession />
        </div>

        {/* Clinical Responsible-Use Advisory */}
        <ScreeningNotice />
      </PageContainer>
    </main>
  );
}
