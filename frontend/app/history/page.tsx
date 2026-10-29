"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { SavedTestResult } from "@/lib/db/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HistoryIcon,
  EyeIcon,
  TrashIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  DownloadIcon,
} from "@/components/ui/icons";

export default function TestHistoryPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [results, setResults] = React.useState<SavedTestResult[]>([]);
  const [resultsLoading, setResultsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Detail Modal / Expanded View State
  const [selectedResult, setSelectedResult] = React.useState<SavedTestResult | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

  // Screening Type Filter
  type FilterType = "all" | "color-vision" | "distance-vision" | "near-vision";
  const [selectedFilter, setSelectedFilter] = React.useState<FilterType>("all");

  const loading = authLoading || (isAuthenticated && resultsLoading);

  const filteredResults = React.useMemo(() => {
    if (selectedFilter === "all") return results;
    return results.filter((r) => r.testType === selectedFilter);
  }, [results, selectedFilter]);

  const filterCounts = React.useMemo(() => {
    return {
      all: results.length,
      "color-vision": results.filter((r) => r.testType === "color-vision").length,
      "distance-vision": results.filter((r) => r.testType === "distance-vision").length,
      "near-vision": results.filter((r) => r.testType === "near-vision").length,
    };
  }, [results]);

  React.useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      return;
    }

    fetch("/api/results")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted) {
          setResults(data?.results || []);
          setResultsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Network error occurred while loading test history.");
          setResultsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved screening result?")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/results/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResults((prev) => prev.filter((r) => r.id !== id));
        if (selectedResult?.id === id) {
          setSelectedResult(null);
        }
      } else {
        alert("Failed to delete the result. Please try again.");
      }
    } catch {
      alert("Network error occurred while deleting result.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPdf = async (item: SavedTestResult) => {
    if (downloadingId === item.id) return;
    setDownloadingId(item.id);

    try {
      const res = await fetch(`/api/results/${item.id}/pdf`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to download screening report PDF.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VisionCare-${item.testType}-${item.id.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Network error occurred while generating PDF.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  // State 1: Unauthenticated Guest View
  if (!authLoading && !isAuthenticated) {
    return (
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/95 text-slate-900 dark:text-white shadow-xl text-center">
          <CardHeader className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
              <HistoryIcon size={24} className="text-teal-600 dark:text-teal-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Test History</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
              Sign in to view your previous vision screening demonstrations and download PDF reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full font-bold">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="block w-full">
              <Button variant="outline" size="md" className="w-full">
                Create an Account
              </Button>
            </Link>
            <div className="pt-2">
              <Link href="/tests" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline underline-offset-4">
                Continue browsing tests as Guest
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HistoryIcon size={20} className="text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Test History
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Saved screening demonstrations and PDF reports for <strong>{user?.displayName}</strong>.
          </p>
        </div>

        <Link href="/tests">
          <Button variant="primary" size="sm" className="gap-1.5 font-bold shadow-md shadow-teal-500/20">
            <span>New Screening</span>
            <ArrowRightIcon size={14} />
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading saved screening history...</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div role="alert" className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/80 text-center py-12 px-4 shadow-sm">
          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
              <EyeIcon size={28} className="text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Saved Results Yet</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Complete a color vision, distance vision, or near reading screening demonstration and click &quot;Save Result&quot; to view your history and download PDF reports here.
            </p>
            <Link href="/tests" className="inline-block pt-2">
              <Button variant="primary" size="md" className="font-bold">
                Start a Screening Test
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Filter Tabs */}
      {!loading && results.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold mr-1">Filter by Test:</span>
          {(
            [
              { id: "all", label: "All Tests", count: filterCounts.all },
              { id: "color-vision", label: "Color Vision", count: filterCounts["color-vision"] },
              { id: "distance-vision", label: "Distance Vision", count: filterCounts["distance-vision"] },
              { id: "near-vision", label: "Near Vision", count: filterCounts["near-vision"] },
            ] as const
          ).map((filter) => {
            const isSelected = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  isSelected
                    ? "bg-teal-50 dark:bg-teal-950 border border-teal-600 dark:border-teal-700 text-teal-900 dark:text-teal-200 font-bold"
                    : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-teal-100 dark:bg-teal-800/60 text-teal-800 dark:text-teal-200" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filtered Empty State */}
      {!loading && results.length > 0 && filteredResults.length === 0 && (
        <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/60 space-y-2">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">No results found for this screening filter.</p>
          <Button variant="outline" size="sm" onClick={() => setSelectedFilter("all")}>
            Show All Tests
          </Button>
        </div>
      )}

      {/* Results List */}
      {!loading && filteredResults.length > 0 && (
        <div className="space-y-3">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {item.testTitle}
                  </span>
                  <Badge variant="primary" className="text-[10px]">
                    {item.matchPercentage}% Agreement
                  </Badge>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-2xl">
                  {item.summaryNote}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>
                    Answered: <strong className="text-slate-800 dark:text-slate-300">{item.answeredCount} of {item.totalItems}</strong>
                  </span>
                  <span>
                    Target Matches: <strong className="text-teal-600 dark:text-teal-400">{item.matchedCount}</strong>
                  </span>
                  {item.unclearCount !== undefined && item.unclearCount > 0 && (
                    <span>
                      Marked Unclear: <strong className="text-amber-600 dark:text-amber-400">{item.unclearCount}</strong>
                    </span>
                  )}
                  <span className="text-slate-500 dark:text-slate-400">
                    Completed: {formatDate(item.completedAt)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800/80">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownloadPdf(item)}
                  disabled={downloadingId === item.id}
                  className="text-xs gap-1.5 font-semibold shadow-sm"
                  aria-label={`Download PDF report for ${item.testTitle}`}
                >
                  <DownloadIcon size={14} />
                  <span>{downloadingId === item.id ? "Generating PDF..." : "Download PDF"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedResult(item)}
                  className="text-xs gap-1.5"
                >
                  <EyeIcon size={14} />
                  <span>Details</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 gap-1.5"
                  aria-label={`Delete ${item.testTitle} result from ${formatDate(item.completedAt)}`}
                >
                  <TrashIcon size={14} />
                  <span>{deletingId === item.id ? "Deleting..." : "Delete"}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single Result Details Modal */}
      {selectedResult && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedResult.testTitle}</h3>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Completed on {formatDate(selectedResult.completedAt)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
                aria-label="Close details"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Total Items</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedResult.totalItems}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Answered</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedResult.answeredCount}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Target Matches</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{selectedResult.matchedCount}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Agreement Rate</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedResult.matchPercentage}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-300 block">Demonstration Summary Note</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">{selectedResult.summaryNote}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300 text-xs">
                <ShieldCheckIcon size={14} className="text-teal-600 dark:text-teal-400" />
                <span>Screening Guidance Notice</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                This saved summary reflects an uncalibrated browser demonstration. It does not measure clinical visual acuity or substitute for a professional eye examination.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDownloadPdf(selectedResult)}
                disabled={downloadingId === selectedResult.id}
                className="gap-1.5 font-bold text-xs shadow-md shadow-teal-500/20"
              >
                <DownloadIcon size={14} />
                <span>{downloadingId === selectedResult.id ? "Generating PDF..." : "Download PDF Report"}</span>
              </Button>

              <Button variant="outline" size="sm" onClick={() => setSelectedResult(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
