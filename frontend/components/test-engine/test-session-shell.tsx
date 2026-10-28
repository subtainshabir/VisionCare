import * as React from "react";
import { ProgressInfo } from "@/types/test-engine";
import { TestProgress } from "./test-progress";
import { TestNavigation } from "./test-navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export interface TestSessionShellProps {
  title: string;
  progress: ProgressInfo;
  allowPrevious?: boolean;
  requireAnswerToAdvance?: boolean;
  onCancelRequest: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  children: React.ReactNode;
}

export function TestSessionShell({
  title,
  progress,
  allowPrevious = true,
  requireAnswerToAdvance = false,
  onCancelRequest,
  onPrevious,
  onNext,
  onComplete,
  children,
}: TestSessionShellProps) {
  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            {title}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Active Session
          </span>
        </div>
        <TestProgress progress={progress} onCancelRequest={onCancelRequest} />
      </CardHeader>

      <CardContent className="pt-6 pb-2 space-y-6">
        {children}

        <TestNavigation
          progress={progress}
          allowPrevious={allowPrevious}
          requireAnswerToAdvance={requireAnswerToAdvance}
          onPrevious={onPrevious}
          onNext={onNext}
          onComplete={onComplete}
        />
      </CardContent>
    </Card>
  );
}
