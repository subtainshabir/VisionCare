import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestCard } from "@/components/screening/test-card";
import { HowItWorks } from "@/components/screening/how-it-works";
import { ScreeningNotice } from "@/components/screening/screening-notice";
import { HeroIllustration } from "@/components/ui/hero-illustration";
import {
  ColorVisionIcon,
  DistanceVisionIcon,
  NearVisionIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090D16] transition-colors">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-teal-500/10 dark:from-cyan-500/10 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <PageContainer maxWidth="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 dark:bg-cyan-950/70 dark:border-cyan-800/80 dark:text-cyan-300 text-xs sm:text-sm font-semibold shadow-md">
                <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-cyan-400 animate-pulse" aria-hidden="true" />
                <span>Digital Vision Screening</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Take a Closer Look at Your Vision.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Accessible browser-based screening demonstrations to test your color discernment, distance acuity, and close reading clarity from your screen.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href="/tests">
                  <Button variant="primary" size="lg" className="shadow-lg shadow-teal-600/20 dark:shadow-cyan-500/25 font-bold gap-2">
                    <span>Explore Tests</span>
                    <ArrowRightIcon size={18} />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg" className="font-semibold">
                    How It Works
                  </Button>
                </a>
              </div>

              {/* Quick Benefit Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#0F172A]/90 border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 shadow-sm dark:shadow-md">
                  <SparklesIcon size={16} className="text-teal-600 dark:text-cyan-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Simple to Use
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#0F172A]/90 border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 shadow-sm dark:shadow-md">
                  <CheckCircleIcon size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">
                    3 Demos
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#0F172A]/90 border border-slate-200 dark:border-slate-800/80 flex items-center gap-2 shadow-sm dark:shadow-md">
                  <ShieldCheckIcon size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Clear Guidance
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Medical Eye HUD Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroIllustration />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Screening Overview Section */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-[#090D16] transition-colors">
        <PageContainer maxWidth="xl">
          <SectionHeading
            badge="Screening Demos"
            title="Available Vision Screenings"
            subtitle="Choose an interactive demonstration to evaluate fundamental visual capabilities."
          />

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
              icon={<ColorVisionIcon size={24} className="text-emerald-600 dark:text-emerald-400" />}
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
              icon={<DistanceVisionIcon size={24} className="text-teal-600 dark:text-cyan-400" />}
            />

            {/* Card 3: Near Vision */}
            <TestCard
              id="near-vision"
              title="Near Vision"
              category="Near Reading Acuity"
              description="Rosenbaum-style near vision chart with calibrated 14-inch viewing distance."
              status="Ready to Test"
              actionLabel="Start Test"
              accent="lavender"
              estimatedTime="2 mins"
              isAvailable={true}
              href="/tests/near-vision"
              icon={<NearVisionIcon size={24} className="text-purple-600 dark:text-purple-400" />}
            />
          </div>
        </PageContainer>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Responsible-Use Notice Section */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-[#090D16] border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <PageContainer maxWidth="lg">
          <ScreeningNotice />
        </PageContainer>
      </section>
    </main>
  );
}
