import * as React from "react";

export interface SnellenOptotypeGlyphProps {
  letter: string;
  sizePx: number;
  className?: string;
}

/**
 * Standard Hermann Snellen 1862 5x5 grid optotype vector glyphs.
 * Each optotype is drawn on a 50x50 coordinate system where every stroke
 * and counter represents exactly 10 units (1/5th letter height).
 */
export function SnellenOptotypeGlyph({
  letter,
  sizePx,
  className = "",
}: SnellenOptotypeGlyphProps) {
  const upper = letter.toUpperCase().trim();

  // Snellen 5x5 vector paths
  switch (upper) {
    case "E":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path d="M 0 0 H 50 V 10 H 10 V 20 H 40 V 30 H 10 V 40 H 50 V 50 H 0 Z" />
        </svg>
      );

    case "F":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path d="M 0 0 H 50 V 10 H 10 V 20 H 40 V 30 H 10 V 50 H 0 Z" />
        </svg>
      );

    case "P":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M 0 0 H 50 V 30 H 10 V 50 H 0 Z M 10 10 H 40 V 20 H 10 Z"
          />
        </svg>
      );

    case "T":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path d="M 0 0 H 50 V 10 H 30 V 50 H 20 V 10 H 0 Z" />
        </svg>
      );

    case "O":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M 10 0 H 40 Q 50 0 50 10 V 40 Q 50 50 40 50 H 10 Q 0 50 0 40 V 10 Q 0 0 10 0 Z M 18 10 H 32 Q 40 10 40 18 V 32 Q 40 40 32 40 H 18 Q 10 40 10 32 V 18 Q 10 10 18 10 Z"
          />
        </svg>
      );

    case "Z":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path d="M 0 0 H 50 V 10 L 14 40 H 50 V 50 H 0 V 40 L 36 10 H 0 Z" />
        </svg>
      );

    case "L":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path d="M 0 0 H 10 V 40 H 50 V 50 H 0 Z" />
        </svg>
      );

    case "D":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M 0 0 H 30 Q 50 0 50 25 Q 50 50 30 50 H 0 Z M 10 10 H 30 Q 40 10 40 25 Q 40 40 30 40 H 10 Z"
          />
        </svg>
      );

    case "C":
      return (
        <svg
          viewBox="0 0 50 50"
          width={sizePx}
          height={sizePx}
          className={`shrink-0 inline-block fill-current ${className}`.trim()}
          aria-hidden="true"
        >
          <path d="M 50 10 V 0 H 10 Q 0 0 0 10 V 40 Q 0 50 10 50 H 50 V 40 H 10 V 10 H 50 Z" />
        </svg>
      );

    default:
      return (
        <span
          style={{ width: sizePx, height: sizePx, fontSize: sizePx * 0.9 }}
          className={`font-mono font-black inline-flex items-center justify-center leading-none select-none ${className}`.trim()}
          aria-hidden="true"
        >
          {upper}
        </span>
      );
  }
}

