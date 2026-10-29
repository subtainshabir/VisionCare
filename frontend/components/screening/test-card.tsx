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
      iconBg: "bg-emerald-950/70 text-emerald-400 border-emerald-800/70",
      badgeVariant: "success" as const,
      categoryTag: "text-emerald-300 bg-emerald-950/60 border-emerald-800/60",
      pulseColor: "bg-emerald-400",
    },
    sky: {
      glowClass: "glow-cyan",
      iconBg: "bg-cyan-950/70 text-cyan-400 border-cyan-800/70",
      badgeVariant: "sky" as const,
      categoryTag: "text-cyan-300 bg-cyan-950/60 border-cyan-800/60",
      pulseColor: "bg-cyan-400",
    },
    lavender: {
      glowClass: "glow-violet",
      iconBg: "bg-purple-950/70 text-purple-400 border-purple-800/70",
      badgeVariant: "lavender" as const,
      categoryTag: "text-purple-300 bg-purple-950/60 border-purple-800/60",
      pulseColor: "bg-purple-400",
    },
  }[accent];

  return (
    <div
      className={`rounded-2xl border border-slate-800/90 bg-[#0F172A]/90 p-6 shadow-xl shadow-black/40 flex flex-col justify-between h-full card-hover-glow ${accentStyles.glowClass}`}
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
          <h3 className="text-xl font-bold tracking-tight text-white">
            {title}
          </h3>
        </div>

        {/* Concise 1-sentence Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          {description}
        </p>

        {/* Duration Spec Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-medium mb-2">
          <ClockIcon size={14} className="text-cyan-400 shrink-0" />
          <span>Estimated duration: ~{estimatedTime}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-end">
        {isAvailable && href ? (
          <Link href={href} className="w-full">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 font-bold shadow-md shadow-cyan-500/20"
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
