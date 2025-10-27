"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string; // must exist in ALLOWED_SVGS
  className?: string; // for tailwind/css sizing & color
  title?: string; // for accessibility
  variant?: "blue" | "green" | "red" | "yellow"; // optional color variant
  style?: React.CSSProperties;
};

export default function InlineSvg({
  name,
  className,
  style,
  title,
  variant,
}: Props) {
  const [markup, setMarkup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/svg-local?name=${encodeURIComponent(name)}&variant=${
            variant || ""
          }`,
          {
            cache: "force-cache",
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const svgText = await res.text();

        if (!canceled) setMarkup(svgText);
      } catch (e: any) {
        if (!canceled) setError(e?.message ?? "Failed to load SVG");
      }
    })();

    return () => {
      canceled = true;
    };
  }, [name]);

  if (error) {
    // Optional: render a fallback shape or nothing
    return <span aria-hidden className={className} />;
  }

  if (!markup) {
    // Optional: lightweight skeleton
    return <span aria-hidden className={className} />;
  }

  // We trust this because we sanitized on the server.
  return (
    <div
      className={className}
      style={style}
      role="img"
      aria-label={title}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
