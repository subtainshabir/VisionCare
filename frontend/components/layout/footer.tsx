import Link from "next/link";
import { PageContainer } from "@/components/ui/page-container";
import { EyeIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800/80 mt-auto transition-colors">
      <PageContainer maxWidth="xl" className="py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pb-8 border-b border-slate-200 dark:border-slate-800/60">
          {/* Brand & summary column */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 dark:bg-cyan-500 flex items-center justify-center text-white dark:text-slate-950 shadow-md shadow-teal-600/20 dark:shadow-cyan-500/20">
                <EyeIcon size={18} className="text-white dark:text-slate-950" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">VisionCare</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Accessible digital vision screening demonstrations designed to explore personal visual function from any device.
            </p>
          </div>

          {/* Quick navigation links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 rounded-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tests"
                  className="text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 rounded-sm"
                >
                  Screening Tests
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 rounded-sm"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Active tests column */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300">
              Active Demonstrations
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/tests/color-vision"
                  className="text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 rounded-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-xs shadow-emerald-400/50" />
                  <span>Color Vision Screening</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tests/distance-vision"
                  className="text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 rounded-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-cyan-400 shadow-xs shadow-cyan-400/50" />
                  <span>Distance Vision Acuity</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tests/near-vision"
                  className="text-slate-600 hover:text-purple-700 dark:text-slate-400 dark:hover:text-purple-300 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 rounded-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400 shadow-xs shadow-purple-400/50" />
                  <span>Near Vision Reading</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Informational disclaimer and copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-500">
          <p className="leading-relaxed max-w-xl">
            <strong>Disclaimer:</strong> VisionCare is an educational tool and does not provide medical diagnoses or replace clinical eye examinations.
          </p>
          <p className="shrink-0 text-slate-500 dark:text-slate-600">
            &copy; 2026 VisionCare. All rights reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
