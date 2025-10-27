import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import InlineSvg from "./SvgInline";

interface SidebarSpriteProps {
  backgroundUrl: string;
  name: string;
}

export default function SidebarSprite({
  backgroundUrl,
  name,
}: SidebarSpriteProps) {
  const [ratio, setRatio] = useState(1);

  const [{ isDragging: isSquareDragging }, squareDrag, preview] = useDrag(
    () => ({
      type: "SPRITE",
      item: {
        type: "SIDEBAR_SPRITE",
        backgroundUrl,
        ratio: ratio,
        name,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [ratio]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    const sidebarSvg = document.getElementById(backgroundUrl);
    const result = sidebarSvg?.getAttribute("viewBox")?.split(" ");
    if (result && result[2] && result[3]) {
      setRatio(parseInt(result[2]) / parseInt(result[3]));
    }
  }, [backgroundUrl]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: 1,
        flexDirection: "column",
      }}
    >
      <Box
        ref={squareDrag as any}
        sx={{ width: 50, height: 50, cursor: "pointer" }}
        style={{ opacity: isSquareDragging ? 0.5 : 1 }}
      >
        {backgroundUrl && (
          <img
            src={`/assets/cells/${backgroundUrl}`}
            alt={name}
            width={50}
            height={50 / ratio}
          />
        )}
      </Box>
      <Typography variant="caption" sx={{ textAlign: "center" }}>
        {name}
      </Typography>
    </Box>
  );
}
