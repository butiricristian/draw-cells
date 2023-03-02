import { Button } from "@mui/material";
import React from "react";
import { Layer, Stage } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../../constants";
import { nextAnimationFrame, prevAnimationFrame } from "../../Frames/actions";
import { Sprite } from "../../Frames/reducers/frames";
import AnimationSprite from "../../Sprites/AnimationSprite";
import State from "../../stateInterface";

const PresentationContainer = ({ style }: any) => {
  const currentFrame = useSelector((state: State) => state.frames.currentFrame);
  const prevFrame = useSelector((state: State) => state.frames.prevFrame);

  const currentFrameSpriteIds = currentFrame.sprites.map((s) => s.id);
  const spritesToRemove =
    prevFrame?.sprites
      .filter((s) => currentFrameSpriteIds.indexOf(s.id) < 0)
      .map((s) => ({ ...s, opacity: 0 })) || [];

  const dispatch = useDispatch();

  return (
    <div
      style={{
        height: "calc(100% - 30px)",
        backgroundColor: "white",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      <div
        style={{
          padding: "10px 50px 20px",
          backgroundColor: "white",
          width: VIEWPORT_WIDTH + 100,
          height: VIEWPORT_HEIGHT + 90,
          ...style,
        }}
      >
        <Stage
          width={VIEWPORT_WIDTH + 100}
          height={VIEWPORT_HEIGHT + 90}
          style={{
            border: "solid 1px #ddd",
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          <Layer>
            {currentFrame.sprites.concat(...spritesToRemove).map((s: Sprite) => (
              <AnimationSprite
                backgroundUrl={s.backgroundUrl}
                id={s.id}
                position={s.position}
                key={`animation-${s.id}`}
                animationType={s.animationType}
                scale={s.scale}
                // angle={s.angle}
                opacity={s.opacity}
                animationProps={s.animationProps}
                duration={s.duration}
                nrOfIterations={s.nrOfIterations}
                // zIndex={s.zIndex}
                width={s.width}
                height={s.height}
                rotation={s.rotation}
                currentFrame={currentFrame}
                prevFrame={prevFrame}
              />
            ))}
          </Layer>
        </Stage>
        </div>
      <div style={{ display: "flex", justifyContent: "space-around", width: VIEWPORT_WIDTH }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => dispatch(prevAnimationFrame())}
        >
          PREV
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => dispatch(nextAnimationFrame())}
        >
          NEXT
        </Button>
      </div>
    </div>
  );
};

export default PresentationContainer;
