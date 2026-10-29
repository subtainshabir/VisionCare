import { SectionHeading } from "@/components/ui/section-heading";
import { PageContainer } from "@/components/ui/page-container";
import { EyeIcon, SunIcon, ShieldCheckIcon } from "@/components/ui/icons";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Choose a Screening",
      description:
        "Select from color discrimination, distance acuity, or near reading demonstrations.",
      icon: <EyeIcon size={22} className="text-teal-600 dark:text-cyan-400" />,
      iconBg: "bg-teal-50 border-teal-200 text-teal-700 dark:bg-cyan-950/70 dark:border-cyan-800/80 dark:text-cyan-400",
    },
    {
      number: "2",
      title: "Set Your Environment",
      description:
        "Adjust room lighting, sit at recommended viewing distance, and wear habitual glasses.",
      icon: <SunIcon size={22} className="text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/70 dark:border-emerald-800/80 dark:text-emerald-400",
    },
    {
      number: "3",
      title: "Review Your Summary",
      description:
        "Receive an objective summary with guidance on when to consult an eye care specialist.",
      icon: <ShieldCheckIcon size={22} className="text-purple-600 dark:text-purple-400" />,
      iconBg: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-800/80 dark:text-purple-400",
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-slate-100/70 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <PageContainer maxWidth="xl">
        <SectionHeading
          badge="Simple 3-Step Process"
          title="How It Works"
          subtitle="A quick, guided screening experience designed for standard browser viewing."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white dark:bg-[#0F172A]/90 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm dark:shadow-xl dark:shadow-black/30 flex flex-col justify-between card-hover-glow transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-mono">
                    Step {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-teal-700 dark:text-cyan-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-cyan-400 animate-pulse" />
                <span>Self-guided &amp; private</span>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
