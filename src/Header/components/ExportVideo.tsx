import { Button } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import State from "../../stateInterface";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../../constants";
import { Sprite } from "../../Frames/reducers/frames";
import Konva from "konva";

export default function ExportVideo({}) {
  const [isExporting, setIsExporting] = useState(false);

  const frames = useSelector((state: State) => state.frames.frames);

  const createStage = () => {
    const container = document.createElement("div");
    container.style.backgroundColor = "white";
    // container.style.display = "none";
    document.body.appendChild(container);

    const stage = new Konva.Stage({
      container: container,
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      stroke: "#eaeaea",
      strokeWidth: 1,
      fillPatternRepeat: "no-repeat",
      fill: "white",
    });

    return stage;
  };

  const renderSprites = (stage: Konva.Stage, sprites: Sprite[]) => {
    stage.destroyChildren();
    const layer = new Konva.Layer();
    stage.add(layer);
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      fill: "white",
    });
    layer.add(background);
    background.moveToBottom();

    for (const s of sprites) {
      const img = new window.Image();
      img.src = `/assets/cells/${s.backgroundUrl}.svg`;

      const sprite = new Konva.Image({
        x: s.position.x,
        y: s.position.y,
        image: img,
        width: s.width,
        height: s.height,
        rotation: s.rotation,
      });
      layer.add(sprite);
    }

    stage.draw();
    return stage.toDataURL();
  };

  const handleExport = async () => {
    setIsExporting(true);
    const stage = createStage();
    const framesDataURLs: string[] = [];

    for (let frameIdx = 0; frameIdx < frames.length - 1; frameIdx++) {
      const frame = frames[frameIdx];
      const nextFrame = frames[frameIdx + 1];

      const maxDuration = Math.max(
        ...frame.sprites.map((s) => s.duration ?? 1)
      );

      for (let i = 0; i < 30 * maxDuration; i++) {
        const newSprites: Sprite[] = [];
        for (const sprite of frame.sprites) {
          const nextSprite = nextFrame.sprites.find((s) => s.id === sprite.id);
          const currentFrameIndex = Math.min(i, 30 * (sprite.duration ?? 1));
          if (nextSprite) {
            if (sprite.animationType === "LINEAR") {
              const newPosition = {
                x:
                  sprite.position.x +
                  (nextSprite.position.x - sprite.position.x) *
                    (currentFrameIndex / (30 * (sprite.duration ?? 1))),
                y:
                  sprite.position.y +
                  (nextSprite.position.y - sprite.position.y) *
                    (currentFrameIndex / (30 * (sprite.duration ?? 1))),
              };
              newSprites.push({
                ...sprite,
                id: `${sprite.id}-${i}`,
                position: newPosition,
              });
            } else if (sprite.animationType === "CIRCULAR") {
              console.log("CIRCULAR ANIMATION", sprite.animationProps);
              const distanceX =
                sprite.position.x - sprite.animationProps.circleX;
              const distanceY =
                sprite.position.y - sprite.animationProps.circleY;
              const angle =
                ((currentFrameIndex / (30 * (sprite.duration ?? 1))) *
                  (sprite.angle ?? 0) *
                  (sprite.animationProps.angleDirection * -1) *
                  Math.PI) /
                180;
              const newPosition = {
                x:
                  sprite.animationProps.circleX +
                  Math.cos(angle) * distanceX -
                  Math.sin(angle) * distanceY,
                y:
                  sprite.animationProps.circleY +
                  Math.sin(angle) * distanceX +
                  Math.cos(angle) * distanceY,
              };
              newSprites.push({
                ...sprite,
                id: `${sprite.id}-${i}`,
                position: newPosition,
              });
            } else if (sprite.animationType === "CHAOTIC") {
              const N = sprite.animationProps.length;
              const F = 30 * (sprite.duration ?? 1);
              const s = (i * (N - 1)) / (F - 1);
              const k = Math.floor(s);
              const a = Math.min(k, N - 1);
              const b = Math.min(k + 1, N - 1);
              const t = s - k;
              let newPosition = { x: sprite.position.x, y: sprite.position.y };
              if (a === b) {
                newPosition = {
                  x: sprite.animationProps[a].x,
                  y: sprite.animationProps[a].y,
                };
              } else {
                newPosition = {
                  x:
                    sprite.animationProps[a].x +
                    t *
                      (sprite.animationProps[b].x - sprite.animationProps[a].x),
                  y:
                    sprite.animationProps[a].y +
                    t *
                      (sprite.animationProps[b].y - sprite.animationProps[a].y),
                };
              }

              newSprites.push({
                ...sprite,
                id: `${sprite.id}-${i}`,
                position: newPosition,
              });
            }
          } else {
            newSprites.push({
              ...sprite,
              id: `${sprite.id}-${i}`,
              opacity: 1 - Math.min(i, 30) / 30,
              position: { x: sprite.position.x, y: sprite.position.y },
            });
          }
        }
        const newFrame = renderSprites(stage, newSprites);
        framesDataURLs.push(newFrame);
      }
    }

    try {
      const response = await fetch("/api/export-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frames: framesDataURLs }), // Replace with actual user ID
      });
      const blob = await response.blob(); // 👈 Get video as a Blob
      const url = URL.createObjectURL(blob); // 👈 Create temporary URL

      // Create a temporary download link and click it
      const link = document.createElement("a");
      link.href = url;
      link.download = "animation.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: Revoke the object URL to free memory
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting video:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? "Exporting..." : "Export Video"}
      </Button>
    </>
  );
}
