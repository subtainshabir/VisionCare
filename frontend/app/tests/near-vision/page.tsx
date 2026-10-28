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
    <main className="flex-1 py-10 sm:py-16">
      <PageContainer maxWidth="xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <li>
              <Link
                href="/"
                className="hover:text-teal-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-xs"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li>
              <Link
                href="/tests"
                className="hover:text-teal-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-xs"
              >
                Screening Tests
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li aria-current="page" className="text-teal-900 font-semibold">
              Near Vision Demonstration
            </li>
          </ol>
        </nav>

        {/* Clear Demonstration Identification Banner */}
        <div className="mb-8 p-4 rounded-xl border border-teal-200 bg-teal-50/70 text-slate-700 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-600" aria-hidden="true" />
            <div>
              <strong className="text-slate-900 font-semibold block sm:inline">
                Near Vision Reading Demonstration:{" "}
              </strong>
              <span>
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
