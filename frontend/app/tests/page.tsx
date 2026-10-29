import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { TestCard } from "@/components/screening/test-card";
import { ScreeningNotice } from "@/components/screening/screening-notice";
import {
  ColorVisionIcon,
  DistanceVisionIcon,
  NearVisionIcon,
  InfoIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Choose Your Vision Test - VisionCare",
  description:
    "Explore interactive vision screening demonstrations including color vision, distance acuity, and close reading clarity.",
};

export default function TestsPage() {
  return (
    <main className="flex-1 py-8 sm:py-12 bg-[#090D16]">
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
            <li aria-current="page" className="text-cyan-400 font-semibold">
              Screening Tests
            </li>
          </ol>
        </nav>

        {/* Dashboard Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
            <span>Interactive Screening Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Choose Your Vision Test
          </h1>
          <p className="mt-2 text-base text-slate-400 max-w-2xl leading-relaxed">
            Select an interactive screening demonstration below. Each module evaluates specific visual capabilities using calibrated presentation principles.
          </p>
        </div>

        {/* Readiness Info Banner */}
        <div className="mb-8 rounded-2xl border border-slate-800 bg-[#0F172A]/90 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-800/80 flex items-center justify-center shrink-0 text-cyan-400">
              <InfoIcon size={18} />
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              <strong className="text-white font-semibold">Screening Demonstrations: </strong>
              All tests run privately in your browser without storing personal health data or requiring an account.
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/80">
            3 Active Demos
          </span>
        </div>

        {/* Three Differentiated Screening Cards */}
        <section aria-labelledby="available-tests-heading" className="mb-12">
          <h2 id="available-tests-heading" className="sr-only">
            Available Vision Screening Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Color Vision */}
            <TestCard
              id="color-vision"
              title="Color Vision"
              category="Color Discrimination"
              description="Identify geometric shapes hidden inside chromatic dot matrices."
              status="Ready to Test"
              actionLabel="Start Test"
              accent="mint"
              estimatedTime="3 mins"
              isAvailable={true}
              href="/tests/color-vision"
              icon={<ColorVisionIcon size={24} className="text-emerald-400" />}
            />

            {/* Card 2: Distance Vision */}
            <TestCard
              id="distance-vision"
              title="Distance Vision"
              category="Visual Acuity"
              description="Recognize letter optotypes presented across calibrated scale steps."
              status="Ready to Test"
              actionLabel="Start Test"
              accent="sky"
              estimatedTime="3 mins"
              isAvailable={true}
              href="/tests/distance-vision"
              icon={<DistanceVisionIcon size={24} className="text-cyan-400" />}
            />

            {/* Card 3: Near Vision */}
            <TestCard
              id="near-vision"
              title="Near Vision"
              category="Near Reading"
              description="Read graded typographic passages and verify keywords at close distance."
              status="Ready to Test"
              actionLabel="Start Test"
              accent="lavender"
              estimatedTime="3 mins"
              isAvailable={true}
              href="/tests/near-vision"
              icon={<NearVisionIcon size={24} className="text-purple-400" />}
            />
          </div>
        </section>

        {/* Responsible-Use Notice */}
        <ScreeningNotice />
      </PageContainer>
    </main>
  );
}
