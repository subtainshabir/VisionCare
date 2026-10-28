import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { HowItWorks } from "@/components/screening/how-it-works";
import { ScreeningNotice } from "@/components/screening/screening-notice";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50">
        <PageContainer maxWidth="lg" className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs sm:text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-600" aria-hidden="true" />
            Browser-Based Vision Screening Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 max-w-3xl mx-auto">
            Vision screening made accessible.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            VisionCare is being developed to help people access convenient, browser-based visual assessment experiences. Test your vision using standardized clinical screening concepts right from your computer or tablet.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
            <Link href="/tests">
              <Button variant="primary" size="lg" className="shadow-sm">
                Explore Vision Tests
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">
                How It Works
              </Button>
            </a>
          </div>

          {/* Decorative Healthcare / Optical Geometric Mark */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2 pb-3 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Standard Calibration Framework
              </span>
              <span>3 Planned Modules</span>
            </div>

            <div className="py-6 flex items-center justify-center gap-8">
              {/* Color visual mark */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
                  <div className="grid grid-cols-2 gap-1 p-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="w-2 h-2 rounded-full bg-emerald-700" />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-600">Color Vision</span>
              </div>

              {/* Distance visual mark */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 font-mono font-bold text-lg">
                  E
                </div>
                <span className="text-[11px] font-medium text-slate-600">Distance</span>
              </div>

              {/* Near visual mark */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 flex flex-col items-center justify-center gap-1">
                  <div className="w-4 h-1 bg-teal-700 rounded-xs" />
                  <div className="w-5 h-1 bg-teal-500 rounded-xs" />
                  <div className="w-3 h-0.5 bg-teal-400 rounded-xs" />
                </div>
                <span className="text-[11px] font-medium text-slate-600">Near Vision</span>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Screening Overview Section */}
      <section className="py-16 sm:py-24 bg-white">
        <PageContainer maxWidth="xl">
          <SectionHeading
            badge="Screening Overview"
            title="Three Planned Vision Assessments"
            subtitle="VisionCare is engineered to support preliminary visual screening across three fundamental visual capabilities."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Color Vision Card */}
            <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary">Planned Module</Badge>
                    <span className="text-xs text-slate-400 font-medium">Coming soon</span>
                  </div>
                  <CardTitle>Color Vision Screening</CardTitle>
                  <CardDescription>
                    Structured pseudoisochromatic plate assessment to screen for common red-green and blue-yellow color vision differences.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                    <strong className="text-slate-900 block mb-1">Assessment Goal:</strong>
                    Detection of color discrimination variations through calibrated chromatic patterns.
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/tests"
                  className="text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  View in Dashboard &rarr;
                </Link>
                <span className="text-xs text-slate-400">Phase 4</span>
              </CardFooter>
            </Card>

            {/* Distance Vision Card */}
            <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary">Planned Module</Badge>
                    <span className="text-xs text-slate-400 font-medium">Coming soon</span>
                  </div>
                  <CardTitle>Distance Vision Acuity</CardTitle>
                  <CardDescription>
                    Digital Snellen-style optotype chart with guided physical viewing distance prompts to assess distant visual clarity.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                    <strong className="text-slate-900 block mb-1">Assessment Goal:</strong>
                    Standardized distance visual acuity rating under controlled screen magnification.
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/tests"
                  className="text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  View in Dashboard &rarr;
                </Link>
                <span className="text-xs text-slate-400">Phase 5</span>
              </CardFooter>
            </Card>

            {/* Near Vision Card */}
            <Card className="flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary">Planned Module</Badge>
                    <span className="text-xs text-slate-400 font-medium">Coming soon</span>
                  </div>
                  <CardTitle>Near Vision &amp; Reading</CardTitle>
                  <CardDescription>
                    Graded typographic reading passages and contrast steps calibrated for typical handheld device and desktop reading distances.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                    <strong className="text-slate-900 block mb-1">Assessment Goal:</strong>
                    Near-point focus and contrast threshold screening for reading clarity.
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/tests"
                  className="text-xs font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  View in Dashboard &rarr;
                </Link>
                <span className="text-xs text-slate-400">Phase 6</span>
              </CardFooter>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Responsible-Use Notice Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
        <PageContainer maxWidth="lg">
          <ScreeningNotice />
        </PageContainer>
      </section>
    </main>
  );
}
