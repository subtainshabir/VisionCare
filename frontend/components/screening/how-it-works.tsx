import { SectionHeading } from "@/components/ui/section-heading";
import { PageContainer } from "@/components/ui/page-container";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose a screening test",
      description:
        "Select from planned color discrimination, distance acuity, or near reading screening modules depending on your assessment purpose.",
      plannedDetail: "Module selection interface",
    },
    {
      number: "02",
      title: "Follow the instructions carefully",
      description:
        "Calibrate your screen brightness, maintain the recommended physical viewing distance, and test each eye individually as instructed.",
      plannedDetail: "Guided calibration prompts",
    },
    {
      number: "03",
      title: "Review the screening information",
      description:
        "Receive an objective summary of visual observations with clear guidance on when to consult a licensed eye care professional.",
      plannedDetail: "Objective screening overview",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <PageContainer maxWidth="xl">
        <SectionHeading
          badge="Planned Workflow"
          title="How VisionCare Works"
          subtitle="An outline of the standardized, guided screening experience planned for upcoming development phases."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-800 font-bold text-sm mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Planned step</span>
                <span className="font-medium text-slate-600">{step.plannedDetail}</span>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
