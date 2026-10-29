"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, RotateCcwIcon, ArrowRightIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { ScreeningLimitations } from "./screening-limitations";
import { ScreeningGuidance } from "./screening-guidance";
import { useAuth } from "@/lib/auth/auth-context";

export interface ScreeningResultsSummaryProps {
  testId: "color-vision" | "distance-vision" | "near-vision";
  testTitle: string;
  status: "completed" | "cancelled";
  totalItems: number;
  answeredCount: number;
  matchedCount: number;
  matchPercentage: number;
  unclearCount?: number;
  summaryNote?: string;
  calibrationDisclaimer?: string;
  onReset: () => void;
  backHref?: string;
  children?: React.ReactNode;
}

export function ScreeningResultsSummary({
  testId,
  testTitle,
  status,
  totalItems,
  answeredCount,
  matchedCount,
  matchPercentage,
  unclearCount,
  summaryNote = "",
  calibrationDisclaimer,
  onReset,
  backHref = "/tests",
  children,
}: ScreeningResultsSummaryProps) {
  const isCancelled = status === "cancelled";
  const { user, isAuthenticated, isGuest, refreshUser, login } = useAuth();

  const [isSaved, setIsSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // In-place auth modal state for expired session or guest saving
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authEmail, setAuthEmail] = React.useState("");
  const [authPassword, setAuthPassword] = React.useState("");
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const handleSaveResult = async () => {
    if (isSaving || isSaved) return;

    if (!isAuthenticated) {
      if (user?.email && !authEmail) {
        setAuthEmail(user.email);
      }
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: testId,
          testTitle,
          summaryNote: summaryNote || `Demonstration completed with ${matchedCount} of ${totalItems} target matches.`,
          totalItems,
          answeredCount,
          matchedCount,
          matchPercentage,
          unclearCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          await refreshUser();
          if (user?.email && !authEmail) {
            setAuthEmail(user.email);
          }
          setSaveError("Session invalid or expired. Sign in below to save this result.");
          setShowAuthModal(true);
        } else {
          setSaveError(data.error || "Failed to save screening result.");
        }
      } else {
        setIsSaved(true);
        setShowAuthModal(false);
      }
    } catch {
      setSaveError("Network error occurred while saving result.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const result = await login(authEmail, authPassword);
      if (!result.success) {
        setAuthError(result.error || "Login failed. Please verify your credentials.");
        setAuthLoading(false);
        return;
      }

      // Successfully authenticated! Now save the screening result immediately
      setSaveError(null);
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: testId,
          testTitle,
          summaryNote: summaryNote || `Demonstration completed with ${matchedCount} of ${totalItems} target matches.`,
          totalItems,
          answeredCount,
          matchedCount,
          matchPercentage,
          unclearCount,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSaved(true);
        setShowAuthModal(false);
        setAuthPassword("");
      } else {
        setSaveError(data.error || "Failed to save result after sign in.");
      }
    } catch {
      setAuthError("Network error occurred during authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0F172A]/95 text-slate-900 dark:text-white">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3">
          {isCancelled ? (
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto shadow-sm">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircleIcon size={24} className="text-teal-600 dark:text-teal-400" />
            </div>
          )}
        </div>

        <Badge variant={isCancelled ? "warning" : "primary"} className="mb-2">
          {isCancelled ? "Session Cancelled" : "Demonstration Complete"}
        </Badge>

        <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {isCancelled ? `${testTitle} Exited` : `${testTitle} Summary`}
        </CardTitle>

        <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1.5 max-w-lg mx-auto leading-relaxed">
          {isCancelled
            ? "You exited the demonstration before completing all items. Incomplete responses were not saved."
            : "Review your demonstration response summary below. Please read the technical limitations and guidance carefully."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {!isCancelled && (
          <>
            {/* Score Metrics Grid */}
            <div
              className={`grid gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center ${
                unclearCount !== undefined
                  ? "grid-cols-2 sm:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3"
              }`}
            >
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-normal">Answered</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {answeredCount} of {totalItems}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-normal">Target Matches</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 text-base">
                  {matchedCount} of {totalItems}
                </span>
              </div>
              {unclearCount !== undefined && (
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-normal">Marked Unclear</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-base">
                    {unclearCount}
                  </span>
                </div>
              )}
              <div className={unclearCount === undefined ? "col-span-2 sm:col-span-1" : ""}>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-normal">Agreement Rate</span>
                <span className="font-bold text-slate-900 dark:text-slate-200 text-base">
                  {matchPercentage}%
                </span>
              </div>
            </div>

            {/* Test History Save Card for Authenticated Users / Guest Notice */}
            {isAuthenticated && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Save to Test History</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Save this screening result to review in your account history at any time.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSaved ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-semibold text-xs">
                        <CheckCircleIcon size={14} className="text-teal-600 dark:text-teal-400" />
                        <span>Saved to History</span>
                      </span>
                      <Link href="/history">
                        <Button variant="outline" size="sm" className="text-xs">
                          View History
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSaveResult}
                      disabled={isSaving}
                      className="font-semibold text-xs shadow-sm"
                    >
                      {isSaving ? "Saving..." : "Save Result"}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {saveError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2"
              >
                <span>{saveError}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      saveError.toLowerCase().includes("session") ||
                      saveError.toLowerCase().includes("auth") ||
                      saveError.toLowerCase().includes("expired")
                    ) {
                      setShowAuthModal(true);
                    } else {
                      handleSaveResult();
                    }
                  }}
                  className="font-semibold underline hover:text-amber-950 dark:hover:text-white shrink-0"
                >
                  {saveError.toLowerCase().includes("session") ||
                  saveError.toLowerCase().includes("auth") ||
                  saveError.toLowerCase().includes("expired")
                    ? "Sign In & Save"
                    : "Retry"}
                </button>
              </div>
            )}

            {isGuest && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/70 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
                  <span>Guest mode: Sign in to save and track your screening results over time.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold underline shrink-0 cursor-pointer"
                >
                  Sign In to Save
                </button>
              </div>
            )}

            {/* Test-Specific Item Breakdown */}
            {children}

            {/* Test-Specific Screening Limitations */}
            <ScreeningLimitations
              testType={testId}
              customLimitations={calibrationDisclaimer}
            />

            {/* Reusable Responsible Screening Guidance */}
            <ScreeningGuidance testName={testTitle} />
          </>
        )}
      </CardContent>

      <CardFooter className="pt-5 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="outline" size="md" onClick={onReset} className="w-full sm:w-auto gap-2">
          <RotateCcwIcon size={16} />
          <span>Retake Test</span>
        </Button>
        <Link href={backHref} className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full shadow-md shadow-teal-500/20 gap-2 font-bold">
            <span>Back to Tests</span>
            <ArrowRightIcon size={16} />
          </Button>
        </Link>
      </CardFooter>

      {/* In-place Authentication Dialog for Expired Session or Guest Saving */}
      {showAuthModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sign In to Save Result</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                  Sign in to save this {testTitle} demonstration to your account history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg text-lg leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {authError && (
              <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleInlineLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={authLoading}
                className="w-full font-bold shadow-md shadow-teal-500/20"
              >
                {authLoading ? "Signing in & Saving..." : "Sign In & Save Result"}
              </Button>
            </form>

            <div className="pt-2 text-center text-slate-500 dark:text-slate-400 text-[11px] border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <Link href="/register" className="text-teal-600 dark:text-teal-400 hover:underline">
                Create new account
              </Link>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="hover:text-slate-800 dark:hover:text-white"
              >
                Continue without saving
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
