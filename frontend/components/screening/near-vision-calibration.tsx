"use client";

import * as React from "react";
import {
  NearDisplayCalibration,
  DEFAULT_NEAR_CALIBRATION,
  STANDARD_CARD_WIDTH_MM,
} from "@/lib/tests/near-vision-data";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@/components/ui/icons";

export interface NearVisionCalibrationProps {
  currentCalibration: NearDisplayCalibration;
  onCalibrationChange: (cal: NearDisplayCalibration) => void;
  onConfirm?: () => void;
}

export function NearVisionCalibration({
  currentCalibration,
  onCalibrationChange,
  onConfirm,
}: NearVisionCalibrationProps) {
  const [cardWidthPx, setCardWidthPx] = React.useState<number>(() => {
    return Math.round(currentCalibration.pixelsPerMm * STANDARD_CARD_WIDTH_MM) || 324;
  });

  const [selectedDistance, setSelectedDistance] = React.useState<number>(
    currentCalibration.viewingDistanceCm
  );

  const [wearsReadingGlasses, setWearsReadingGlasses] = React.useState<boolean>(
    currentCalibration.wearsReadingGlasses
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
      viewingDistanceCm: selectedDistance,
      isCardCalibrated: true,
      wearsReadingGlasses,
    });
  };

  const adjustWidth = (delta: number) => {
    const newWidth = Math.max(220, Math.min(460, cardWidthPx + delta));
    setCardWidthPx(newWidth);
    const newPpm = newWidth / STANDARD_CARD_WIDTH_MM;
    setIsCalibrated(true);
    onCalibrationChange({
      pixelsPerMm: newPpm,
      viewingDistanceCm: selectedDistance,
      isCardCalibrated: true,
      wearsReadingGlasses,
    });
  };

  const handleDistanceChange = (distCm: number) => {
    setSelectedDistance(distCm);
    onCalibrationChange({
      ...currentCalibration,
      viewingDistanceCm: distCm,
    });
  };

  const handleGlassesToggle = (wears: boolean) => {
    setWearsReadingGlasses(wears);
    onCalibrationChange({
      ...currentCalibration,
      wearsReadingGlasses: wears,
    });
  };

  const handleUseStandard = () => {
    setCardWidthPx(324);
    setIsCalibrated(false);
    onCalibrationChange({
      ...DEFAULT_NEAR_CALIBRATION,
      viewingDistanceCm: selectedDistance,
      wearsReadingGlasses,
      isCardCalibrated: false,
    });
  };

  // Card height maintaining standard 85.60 x 53.98 mm aspect ratio (1.5857)
  const cardHeightPx = Math.round(cardWidthPx / 1.5857);
  const estimatedDpi = Math.round(currentCalibration.pixelsPerMm * 25.4);

  return (
    <div className="space-y-6">
      {/* Step 1: Reading Glasses Check */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
            1
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Corrective Reading Lenses
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          If you normally wear glasses or contacts for close reading, wear them for this test:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleGlassesToggle(true)}
            className={`p-3 rounded-xl border text-left transition-all ${
              wearsReadingGlasses
                ? "border-teal-500 bg-teal-50/80 dark:bg-teal-950/60 ring-2 ring-teal-400/20 text-teal-900 dark:text-teal-100"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Wearing Reading Glasses / Lenses</span>
              {wearsReadingGlasses && (
                <CheckCircleIcon size={16} className="text-teal-600 dark:text-teal-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              Wearing my usual readers, bifocals, or contacts.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleGlassesToggle(false)}
            className={`p-3 rounded-xl border text-left transition-all ${
              !wearsReadingGlasses
                ? "border-teal-500 bg-teal-50/80 dark:bg-teal-950/60 ring-2 ring-teal-400/20 text-teal-900 dark:text-teal-100"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">No Reading Glasses</span>
              {!wearsReadingGlasses && (
                <CheckCircleIcon size={16} className="text-teal-600 dark:text-teal-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              Testing without corrective close-reading lenses.
            </span>
          </button>
        </div>
      </div>

      {/* Step 2: Viewing Distance Confirmation */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Reading Viewing Distance (14 in / ~35 cm)
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          The Rosenbaum Pocket Screener protocol requires a <strong>14-inch (35 cm)</strong> viewing distance.
          A simple anatomical reference is the distance from your <strong>elbow to your knuckles / closed fist</strong>.
        </p>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[
            { cm: 30, label: "30 cm", note: "12 in (Close)" },
            { cm: 35, label: "35 cm", note: "14 in (Rosenbaum Standard)" },
            { cm: 40, label: "40 cm", note: "16 in (Arm's length)" },
          ].map((opt) => {
            const isSelected = selectedDistance === opt.cm;
            return (
              <button
                key={opt.cm}
                type="button"
                onClick={() => handleDistanceChange(opt.cm)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "border-teal-500 bg-teal-50/80 dark:bg-teal-950/60 ring-2 ring-teal-400/20 text-teal-900 dark:text-teal-100"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <span className="text-xs font-bold block">{opt.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {opt.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Screen Size Calibration (Optional Physical Card) */}
      <div className="space-y-3 pt-1 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Screen Scaling Calibration (Optional)
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                isCalibrated
                  ? "bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
              }`}
            >
              {isCalibrated ? "Card Calibrated" : "Est. 96 DPI"}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Hold any standard card (credit card, ID, or driver&apos;s license) directly against your screen and adjust the slider until the blue rectangle matches the physical card width (85.60 mm).
        </p>

        {/* Visual Card Target */}
        <div className="flex flex-col items-center justify-center py-4 px-2 bg-slate-100/70 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 overflow-hidden">
          <div
            style={{ width: `${cardWidthPx}px`, height: `${cardHeightPx}px` }}
            className="rounded-xl border-2 border-teal-500 bg-teal-100/40 dark:bg-teal-900/30 flex flex-col items-center justify-center text-center p-2 transition-[width,height] duration-75 relative shadow-sm"
          >
            <div className="absolute top-2 left-2.5 flex items-center gap-1.5">
              <div className="w-2.5 h-2 rounded-xs bg-amber-400/80 dark:bg-amber-300/80" />
              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                85.60 mm
              </span>
            </div>

            <span className="text-xs font-semibold text-teal-900 dark:text-teal-100">
              Match Physical Card Width
            </span>
            <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 mt-0.5">
              {cardWidthPx} px &bull; {estimatedDpi} DPI
            </span>
          </div>

          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
            Hold your card against the box above &bull; 100% browser zoom recommended
          </span>
        </div>

        {/* Slider & Fine Adjustment Controls */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustWidth(-2)}
              className="text-xs font-mono font-bold px-2 py-1 h-8"
              aria-label="Decrease width by 2 pixels"
            >
              -2px
            </Button>

            <input
              type="range"
              min={220}
              max={460}
              step={1}
              value={cardWidthPx}
              onChange={handleSliderChange}
              aria-label="Calibrate card width in pixels"
              className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600 dark:accent-teal-400"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustWidth(2)}
              className="text-xs font-mono font-bold px-2 py-1 h-8"
              aria-label="Increase width by 2 pixels"
            >
              +2px
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Pixels/mm: <strong>{currentCalibration.pixelsPerMm.toFixed(2)}</strong></span>
            <button
              type="button"
              onClick={handleUseStandard}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
            >
              Reset to 96 DPI estimate
            </button>
          </div>
        </div>
      </div>

      {onConfirm && (
        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="md" onClick={onConfirm}>
            Continue to Screening
          </Button>
        </div>
      )}
    </div>
  );
}
