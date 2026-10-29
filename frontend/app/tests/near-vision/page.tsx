import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { NearVisionSession } from "@/components/screening/near-vision-session";
import { ScreeningNotice } from "@/components/screening/screening-notice";

export const metadata: Metadata = {
  title: "Near Vision Reading Demonstration - VisionCare",
  description:
    "An educational reading demonstration presenting controlled typographic passages at close reading distance to explore digital reading experiences.",
};

export default function NearVisionPage() {
  return (
    <main className="flex-1 py-10 sm:py-16 bg-[#090D16]">
      <PageContainer maxWidth="xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <li>
              <Link
                href="/"
                className="hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xs"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-600">
              /
            </li>
            <li>
              <Link
                href="/tests"
                className="hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xs"
              >
                Screening Tests
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-600">
              /
            </li>
            <li aria-current="page" className="text-cyan-400 font-semibold">
              Near Vision Demonstration
            </li>
          </ol>
        </nav>

        {/* Clear Demonstration Identification Banner */}
        <div className="mb-8 p-4 rounded-2xl border border-cyan-500/20 bg-[#0F172A]/90 text-slate-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
            <div>
              <strong className="text-white font-bold block sm:inline">
                Near Vision Reading Demonstration:{" "}
              </strong>
              <span className="text-slate-400">
                Presents graded reading passages to explore browser-based close reading legibility. Does not measure clinical near acuity (Jaeger/logMAR) or diagnose presbyopia.
              </span>
            </div>
          </div>
          <Badge variant="primary" className="shrink-0 text-[11px]">
            Educational Demo
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
