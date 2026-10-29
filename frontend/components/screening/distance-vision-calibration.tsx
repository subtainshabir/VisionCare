"use client";

import * as React from "react";
import {
  DisplayCalibration,
  DEFAULT_CALIBRATION,
  STANDARD_CARD_WIDTH_MM,
} from "@/lib/tests/distance-vision-data";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, MonitorIcon } from "@/components/ui/icons";

export interface DistanceVisionCalibrationProps {
  currentCalibration: DisplayCalibration;
  onCalibrationChange: (cal: DisplayCalibration) => void;
  onConfirm?: () => void;
}

export function DistanceVisionCalibration({
  currentCalibration,
  onCalibrationChange,
  onConfirm,
}: DistanceVisionCalibrationProps) {
  const [cardWidthPx, setCardWidthPx] = React.useState<number>(() => {
    return Math.round(currentCalibration.pixelsPerMm * STANDARD_CARD_WIDTH_MM) || 324;
  });

  const [selectedDistance, setSelectedDistance] = React.useState<number>(
    currentCalibration.viewingDistanceMeters
  );

  const [isCalibrated, setIsCalibrated] = React.useState<boolean>(
    currentCalibration.isCardCalibrated
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setCardWidthPx(newWidth);
    const newPpm = newWidth / STANDARD_CARD_WIDTH_MM;
    setIsCalibrated(true);
    onCalibrationChange({
      pixelsPerMm: newPpm,
      viewingDistanceMeters: selectedDistance,
      isCardCalibrated: true,
    });
  };

  const adjustWidth = (delta: number) => {
    const newWidth = Math.max(220, Math.min(460, cardWidthPx + delta));
    setCardWidthPx(newWidth);
    const newPpm = newWidth / STANDARD_CARD_WIDTH_MM;
    setIsCalibrated(true);
    onCalibrationChange({
      pixelsPerMm: newPpm,
      viewingDistanceMeters: selectedDistance,
      isCardCalibrated: true,
    });
  };

  const handleDistanceChange = (dist: number) => {
    setSelectedDistance(dist);
    onCalibrationChange({
      ...currentCalibration,
      viewingDistanceMeters: dist,
    });
  };

  const handleUseStandard = () => {
    setCardWidthPx(324);
    setIsCalibrated(false);
    onCalibrationChange({
      ...DEFAULT_CALIBRATION,
      viewingDistanceMeters: selectedDistance,
      isCardCalibrated: false,
    });
  };

  // Card height maintaining standard 85.60 x 53.98 mm aspect ratio (1.586)
  const cardHeightPx = Math.round(cardWidthPx / 1.5857);

  return (
    <div className="space-y-6">
      {/* Step 1: Viewing Distance Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <MonitorIcon size={16} className="text-teal-600 dark:text-teal-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Step 1: Choose Your Viewing Distance
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Position your chair and measure your physical distance from the display:
        </p>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[
            { meters: 1.0, label: "1.0 m", note: "3.3 ft (Desk)" },
            { meters: 1.5, label: "1.5 m", note: "5.0 ft (Standard)" },
            { meters: 2.0, label: "2.0 m", note: "6.6 ft (Room)" },
          ].map((opt) => {
            const isSelected = selectedDistance === opt.meters;
            return (
              <button
                key={opt.meters}
                type="button"
                onClick={() => handleDistanceChange(opt.meters)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-teal-50 dark:bg-teal-950/80 border-teal-600 dark:border-teal-400 text-teal-900 dark:text-teal-200 font-bold shadow-xs ring-1 ring-teal-600 dark:ring-teal-400"
                    : "bg-white dark:bg-slate-900/80 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-400"
                }`}
              >
                <span className="block text-sm font-bold">{opt.label}</span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {opt.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Screen Calibration using Standard Physical Card */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Step 2: Screen Size Calibration (Optional)
          </h4>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
              isCalibrated
                ? "bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            {isCalibrated ? "Card-Calibrated" : "Standard 96 DPI Estimate"}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Hold a standard credit card, driver&apos;s license, or transit card up to the screen. Adjust the slider until the outline matches your physical card exactly.
        </p>

        {/* Visual Card Outline */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div
            style={{ width: cardWidthPx, height: cardHeightPx }}
            className="border-2 border-dashed border-teal-600 dark:border-teal-400 rounded-xl bg-white shadow-md flex flex-col justify-between p-3 select-none transition-all duration-75 relative max-w-full"
          >
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span className="w-6 h-5 rounded bg-amber-200 border border-amber-300 inline-block" />
              <span>Standard Card</span>
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-slate-800 block">
                Physical Width: 85.6 mm (3.37 in)
              </span>
              <span className="text-[10px] text-teal-700 font-mono font-semibold">
                {cardWidthPx} px on screen (~{Math.round(cardWidthPx / STANDARD_CARD_WIDTH_MM * 25.4)} DPI)
              </span>
            </div>

            <div className="text-right text-[10px] text-slate-400 font-mono">
              ISO/IEC 7810 ID-1
            </div>
          </div>

          {/* Slider and Fine Adjustment Controls */}
          <div className="w-full max-w-sm mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustWidth(-2)}
                className="h-8 w-8 p-0 shrink-0 font-bold"
                aria-label="Decrease card size by 2 pixels"
              >
                -
              </Button>
              <input
                type="range"
                min="220"
                max="460"
                value={cardWidthPx}
                onChange={handleSliderChange}
                aria-label="Adjust on-screen card width to match physical card"
                className="w-full accent-teal-600 dark:accent-teal-400 cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => adjustWidth(2)}
                className="h-8 w-8 p-0 shrink-0 font-bold"
                aria-label="Increase card size by 2 pixels"
              >
                +
              </Button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <button
                type="button"
                onClick={handleUseStandard}
                className="underline hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Reset to Standard 96 DPI
              </button>
              {isCalibrated && (
                <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                  <CheckCircleIcon size={12} />
                  <span>Card Calibrated</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {onConfirm && (
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onConfirm}
            className="w-full font-bold shadow-md shadow-teal-500/20"
          >
            Start Distance Screening
          </Button>
        </div>
      )}
    </div>
  );
}

