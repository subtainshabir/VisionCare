import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockIcon, ArrowRightIcon } from "@/components/ui/icons";

export interface TestCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  targetMeasurement?: string;
  status?: string;
  actionLabel?: string;
  icon: React.ReactNode;
  href?: string;
  isAvailable?: boolean;
  accent?: "mint" | "sky" | "lavender";
  estimatedTime?: string;
}

export function TestCard({
  title,
  category,
  description,
  status = "Ready to Test",
  actionLabel = "Start Test",
  icon,
  href,
  isAvailable = true,
  accent = "mint",
  estimatedTime = "3 mins",
}: TestCardProps) {
  const accentStyles = {
    mint: {
      glowClass: "glow-emerald",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-800/70",
      badgeVariant: "success" as const,
      categoryTag: "text-emerald-800 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800/60",
      pulseColor: "bg-emerald-500 dark:bg-emerald-400",
    },
    sky: {
      glowClass: "glow-cyan",
      iconBg: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-cyan-950/70 dark:text-cyan-400 dark:border-cyan-800/70",
      badgeVariant: "sky" as const,
      categoryTag: "text-teal-800 bg-teal-50 border-teal-200 dark:text-cyan-300 dark:bg-cyan-950/60 dark:border-cyan-800/60",
      pulseColor: "bg-teal-500 dark:bg-cyan-400",
    },
    lavender: {
      glowClass: "glow-violet",
      iconBg: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/70 dark:text-purple-400 dark:border-purple-800/70",
      badgeVariant: "lavender" as const,
      categoryTag: "text-purple-800 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-950/60 dark:border-purple-800/60",
      pulseColor: "bg-purple-500 dark:bg-purple-400",
    },
  }[accent];

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0F172A]/90 p-6 shadow-sm dark:shadow-xl dark:shadow-black/40 flex flex-col justify-between h-full card-hover-glow ${accentStyles.glowClass}`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${accentStyles.categoryTag}`}
          >
            {category}
          </span>
          <Badge variant={isAvailable ? accentStyles.badgeVariant : "neutral"} className="text-[11px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${accentStyles.pulseColor} animate-pulse`}
              aria-hidden="true"
            />
            {status}
          </Badge>
        </div>

        {/* Visual Icon & Title */}
        <div className="flex items-center gap-3.5 mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-md ${accentStyles.iconBg}`}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>

        {/* Concise 1-sentence Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {description}
        </p>

        {/* Duration Spec Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium mb-2">
          <ClockIcon size={14} className="text-teal-600 dark:text-cyan-400 shrink-0" />
          <span>Estimated duration: ~{estimatedTime}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 mt-4 flex items-center justify-end">
        {isAvailable && href ? (
          <Link href={href} className="w-full">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 font-bold shadow-md"
            >
              <span>{actionLabel}</span>
              <ArrowRightIcon size={16} />
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="md"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed opacity-40 w-full"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
