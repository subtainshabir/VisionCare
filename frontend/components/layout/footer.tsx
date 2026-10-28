import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <PageContainer maxWidth="xl" className="py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100 pb-8 mb-8">
          {/* Brand & summary column */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-2xs">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-base">VisionCare</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              An accessible browser-based vision screening platform engineered to provide preliminary visual assessment experiences.
            </p>
          </div>

          {/* Quick navigation links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tests"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  Screening Tests
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#responsible-use"
                  className="text-slate-600 hover:text-teal-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm"
                >
                  Responsible Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Planned modules list */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Screening Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Color Vision Assessment (Coming soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Distance Vision Acuity (Coming soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>Near Vision &amp; Reading (Coming soon)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Informational clinical disclaimer and copyright */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl leading-relaxed text-slate-500">
            <strong className="font-semibold text-slate-700">Screening Disclaimer: </strong>
            VisionCare is an educational and preliminary screening platform. Digital screenings do not constitute medical diagnoses and cannot substitute for an in-person, dilated eye examination by an eye doctor.
          </p>
          <p className="shrink-0 text-slate-400">
            &copy; 2026 VisionCare. All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
