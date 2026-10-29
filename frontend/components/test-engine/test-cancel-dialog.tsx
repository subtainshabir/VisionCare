"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export interface TestCancelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function TestCancelDialog({
  isOpen,
  onClose,
  onConfirm,
}: TestCancelDialogProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
      aria-describedby="cancel-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 id="cancel-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
          Exit Screening Session?
        </h3>

        <p id="cancel-dialog-desc" className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          Are you sure you want to discard this screening session? All recorded responses for this in-progress test will be cleared.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="md" onClick={onClose} className="w-full sm:w-auto">
            Resume Screening
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 text-white border-transparent"
          >
            Discard &amp; Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
