"use client";

export type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CornerArtProps {
  position: CornerPosition;
  imageUrl: string;
  size?: number;           // px width/height of the corner element
  fadeIntensity?: number;  // 0–100: how far image spreads before transparent
}

function getMaskGradient(position: CornerPosition, fadeIntensity: number): string {
  // The gradient goes FROM opaque (at the corner) TO transparent (toward center)
  // fadeIntensity = 10 → tight sliver; 90 → wide spread
  const stop = `${fadeIntensity}%`;
  switch (position) {
    case "top-left":
      return `radial-gradient(ellipse at top left, black 0%, transparent ${stop})`;
    case "top-right":
      return `radial-gradient(ellipse at top right, black 0%, transparent ${stop})`;
    case "bottom-left":
      return `radial-gradient(ellipse at bottom left, black 0%, transparent ${stop})`;
    case "bottom-right":
      return `radial-gradient(ellipse at bottom right, black 0%, transparent ${stop})`;
  }
}

function getPositionStyle(position: CornerPosition): React.CSSProperties {
  switch (position) {
    case "top-left":     return { top: 0, left: 0 };
    case "top-right":    return { top: 0, right: 0 };
    case "bottom-left":  return { bottom: 0, left: 0 };
    case "bottom-right": return { bottom: 0, right: 0 };
  }
}

export default function CornerArt({
  position,
  imageUrl,
  size = 300,
  fadeIntensity = 60,
}: CornerArtProps) {
  const mask = getMaskGradient(position, fadeIntensity);
  const posStyle = getPositionStyle(position);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        ...posStyle,
        width: size,
        height: size,
        zIndex: -1,
        pointerEvents: "none",
        WebkitMaskImage: mask,
        maskImage: mask,
        overflow: "hidden",
      }}
    >
      {/* Using <img> instead of next/image to support any arbitrary admin-configured URL */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position.replace("-", " "),
          display: "block",
        }}
      />
    </div>
  );
}
