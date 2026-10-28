import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { TestCard } from "@/components/screening/test-card";
import { ScreeningNotice } from "@/components/screening/screening-notice";

export const metadata: Metadata = {
  title: "Vision Screening Tests - VisionCare",
  description:
    "Explore planned vision screening modules including color vision, distance acuity, and near vision testing.",
};

export default function TestsPage() {
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
            <li aria-current="page" className="text-teal-900 font-semibold">
              Screening Tests
            </li>
          </ol>
        </nav>

        {/* Dashboard Header */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" aria-hidden="true" />
            Screening Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Vision Screening Tests
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Review the planned visual screening modules below. Each module is being developed based on standardized clinical principles to provide accessible, browser-based visual assessment.
          </p>
        </div>

        {/* Informational Readiness Banner */}
        <div className="mb-10 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Phase 3 Interface State: Modules in Development
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Individual testing procedures, calibrated optotypes, and scoring engines will be activated in assigned future phases.
              </p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            3 Planned Assessments
          </span>
        </div>

        {/* Three Differentiated Screening Cards */}
        <section aria-labelledby="planned-tests-heading" className="mb-14">
          <h2 id="planned-tests-heading" className="sr-only">
            Available Screening Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Color Vision */}
            <TestCard
              id="color-vision"
              title="Color Vision"
              category="Color Discrimination"
              description="An educational demonstration assessing color discernment across red-green and blue-yellow combinations using geometric shapes."
              targetMeasurement="Red-Green & Blue-Yellow Discrimination"
              status="Demonstration Ready"
              actionLabel="Start Demonstration"
              isAvailable={true}
              href="/tests/color-vision"
              icon={
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="15" r="1" fill="currentColor" />
                  <circle cx="9" cy="14" r="1" fill="currentColor" />
                </svg>
              }
            />

            {/* Card 2: Distance Vision */}
            <TestCard
              id="distance-vision"
              title="Distance Vision"
              category="Visual Acuity"
              description="An educational Snellen-style demonstration presenting high-contrast letter optotypes to explore browser-based distance screening."
              targetMeasurement="Optotype Recognition (Demonstration)"
              status="Demonstration Ready"
              actionLabel="Start Demonstration"
              isAvailable={true}
              href="/tests/distance-vision"
              icon={
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h10" />
                  <path d="M4 18h16" />
                  <path d="M4 6v12" />
                </svg>
              }
            />

            {/* Card 3: Near Vision */}
            <TestCard
              id="near-vision"
              title="Near Vision"
              category="Near-Point Reading"
              description="An educational reading demonstration presenting controlled typographic passages and character sequences at close reading distance."
              targetMeasurement="Reading Legibility (Demonstration)"
              status="Demonstration Ready"
              actionLabel="Start Demonstration"
              isAvailable={true}
              href="/tests/near-vision"
              icon={
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Responsible-Use Notice */}
        <ScreeningNotice />
      </PageContainer>
    </main>
  );
}
