import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TestCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  targetMeasurement: string;
  status?: string;
  actionLabel?: string;
  icon: React.ReactNode;
  href?: string;
  isAvailable?: boolean;
}

export function TestCard({
  title,
  category,
  description,
  targetMeasurement,
  status = "Coming soon",
  actionLabel = "Not available yet",
  icon,
  href,
  isAvailable = false,
}: TestCardProps) {
  return (
    <Card className="flex flex-col justify-between h-full hover:border-slate-300 transition-colors">
      <div>
        <CardHeader>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/80">
              {category}
            </span>
            <Badge variant={isAvailable ? "primary" : "neutral"} className="text-[11px]">
              {status}
            </Badge>
          </div>

          <div className="flex items-start gap-3.5 mt-1">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-teal-800">
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Target: {targetMeasurement}
              </p>
            </div>
          </div>

          <CardDescription className="mt-4 text-slate-600 leading-relaxed text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-200/60 text-xs text-slate-500 leading-relaxed">
            <strong className="font-semibold text-slate-700">Planned Methodology: </strong>
            Standardized optical presentation designed for calibrated screen distances and controlled browser conditions.
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-4 border-t border-slate-100 mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <span className={`text-xs font-medium ${isAvailable ? "text-teal-800" : "text-slate-400"}`}>
          {isAvailable ? "Demonstration module ready" : "Screening module in development"}
        </span>
        {isAvailable && href ? (
          <Link href={href} className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto shadow-xs">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed opacity-60 w-full sm:w-auto"
          >
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
