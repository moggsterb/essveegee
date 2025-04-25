import React from "react";

interface BaseSvgProps {
  width: number;
  height: number;
  bgColor: string;
  children?: React.ReactNode;
}

export const BaseSvg: React.FC<BaseSvgProps> = ({
  width = 100,
  height = 100,
  bgColor = "transparent",
  children,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }}
      fill="none"
    >
      {/* Background rectangle if a background color is specified */}
      {bgColor !== "transparent" && (
        <rect width={width} height={height} fill={bgColor} />
      )}

      {/* Any SVG content passed as children will be rendered here */}
      {children}
    </svg>
  );
};

export default BaseSvg;
