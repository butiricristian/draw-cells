import React, { memo, useEffect, useState } from "react";
import { SPRITE_TO_SVG_ELEMENT_MAP } from "../constants";
import { Sprite } from "../Frames/reducers/frames";
import { Box } from "@mui/material";

const styles: any = {
  position: "absolute",
  cursor: "pointer",
  width: 50,
  height: 50,
};

const BaseSpritePreview = memo(function BoxDragPreview(props: Sprite) {
  const [tickTock, setTickTock] = useState(false);
  useEffect(
    function subscribeToIntervalTick() {
      const interval = setInterval(() => setTickTock(!tickTock), 500);
      return () => clearInterval(interval);
    },
    [tickTock]
  );
  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP;

  return (
    <div style={styles}>
      <Box
        sx={{
          border: "dashed 2px transparent",
          borderWidth: 2,
          width: "100%",
          height: "100%",
          "& svg": {
            height: "100%",
            width: "100%",
          },
        }}
        style={{
          backgroundColor: "transparent",
          transform: `scale(${props.scale})`,
          zIndex: props.zIndex,
        }}
      >
        {props.backgroundUrl && spriteToSvgMap[props.backgroundUrl]}
      </Box>
    </div>
  );
});

export default BaseSpritePreview;
