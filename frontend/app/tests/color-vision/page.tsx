import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { ColorVisionSession } from "@/components/screening/color-vision-session";
import { ScreeningNotice } from "@/components/screening/screening-notice";

export const metadata: Metadata = {
  title: "Color Vision Screening Demonstration - VisionCare",
  description:
    "An educational demonstration of browser-based color vision screening using geometric shapes and calibrated chromatic patterns.",
};

export default function ColorVisionPage() {
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
              Color Vision Demonstration
            </li>
          </ol>
        </nav>

        {/* Clear Demonstration Identification Banner */}
        <div className="mb-8 p-4 rounded-xl border border-teal-200 bg-teal-50/70 text-slate-700 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-teal-600" aria-hidden="true" />
            <div>
              <strong className="text-slate-900 font-semibold block sm:inline">
                Original Color Vision Demonstration:{" "}
              </strong>
              <span>
                Uses calibrated geometric shapes across red-green and blue-yellow palettes. Not a clinical Ishihara test.
              </span>
            </div>
          </div>
          <Badge variant="primary" className="shrink-0 text-[11px]">
            Educational Demo
          </Badge>
        </div>

        {/* Interactive Test Engine Session */}
        <div className="mb-14">
          <ColorVisionSession />
        </div>

        {/* Clinical Responsible-Use Advisory */}
        <ScreeningNotice />
      </PageContainer>
    </main>
  );
}
