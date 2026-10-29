import * as React from "react";

export interface AIVisionIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  sparkleColor?: string;
}

/**
 * Custom AI Vision Assistant Icon:
 * Seamlessly integrates a stylized human eye contour with an intelligent
 * 4-point assistant sparkle symbol at the upper-right corner.
 */
export function AIVisionIcon({
  size = 24,
  className = "",
  sparkleColor = "currentColor",
  ...props
}: AIVisionIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Stylized Human Eye Outline */}
      <path
        d="M2.5 14.5C4.5 9 9.5 5.5 14 5.5C18.5 5.5 23.5 9 25.5 14.5C23.5 20 18.5 23.5 14 23.5C9.5 23.5 4.5 20 2.5 14.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Iris & Pupil */}
      <circle
        cx="14"
        cy="14.5"
        r="4.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="14"
        cy="14.5"
        r="2"
        fill="currentColor"
      />

      {/* Catchlight Reflection in Pupil */}
      <circle
        cx="15.2"
        cy="13.3"
        r="0.8"
        fill="white"
      />

      {/* Intelligent AI Sparkle Symbol (Upper Right) */}
      <path
        d="M22.5 2.5C22.5 4.5 23.5 5.5 25.5 5.5C23.5 5.5 22.5 6.5 22.5 8.5C22.5 6.5 21.5 5.5 19.5 5.5C21.5 5.5 22.5 4.5 22.5 2.5Z"
        fill={sparkleColor}
      />
      <circle
        cx="22.5"
        cy="5.5"
        r="0.7"
        fill="white"
      />
    </svg>
  );
}

