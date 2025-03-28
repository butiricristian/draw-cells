import { Box, Typography } from "@mui/material";
import React, { LegacyRef, useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { SPRITE_TO_SVG_ELEMENT_MAP } from "../constants";

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

  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP;

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
        {backgroundUrl && spriteToSvgMap[backgroundUrl]}
      </Box>
      <Typography variant="body2">{name}</Typography>
    </Box>
  );
}
