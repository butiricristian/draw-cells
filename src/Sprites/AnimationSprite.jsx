import React from "react";
import { animated, to, useSpring } from "@react-spring/konva";

function getCurrentAndPrevSprite(animationProps) {
  const {prevFrame, id} = animationProps

  const prevSprite = prevFrame?.sprites.find((s) => s.id === id);
  const currentSprite = animationProps

  if (!prevSprite) {
    return [null, currentSprite]
  }

  return [prevSprite, currentSprite]
}

export default function AnimationSprite(props) {
  const [prevSprite, currentSprite] = getCurrentAndPrevSprite(props)
  const { currentFrame, prevFrame } = props

  const {
    position,
    backgroundUrl,
    scale,
    width,
    height,
    rotation,
    opacity,
  } = currentSprite

  const {
    animationType,
    animationProps: spriteAnimationProps,
    nrOfIterations,
    duration,
  } = prevSprite || {}

  console.log("Previous Sprite: ", prevSprite)
  console.log("Current Sprite: ", currentSprite)

  const animationDuration = (duration || 1) * 1000;
  const currentNrOfIterations = nrOfIterations || 10

  //SCALE PROPS
  const scaleProps = useSpring({
    to: { scale, rotation, width, height },
    config: { duration: animationDuration },
  });

  // OPACITY PROPS
  const opacityProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: opacity },
    config: { duration: 500 },
  });

  // LINEAR PROPS
  const linearProps = useSpring({
    from: {x: prevSprite?.position?.x || 0, y: prevSprite?.position?.y || 0},
    to: spriteAnimationProps,
    config: { duration: animationDuration },
  });

  // CHAOTIC PROPS
  console.log(animationDuration)
  console.log(currentNrOfIterations)
  const chaoticProps = useSpring({
    from: {x: prevSprite?.position?.x || 0, y: prevSprite?.position?.y || 0},
    to: spriteAnimationProps,
    config: {
      duration:
        Math.round((animationDuration / currentNrOfIterations) * 100) / 100,
    },
  });

  //CIRCULAR PROPS
  const finalAngle = spriteAnimationProps?.finalAngle || 0;
  const crtFrameId = parseInt(String(currentFrame.id || "1"));
  const prevFrameId = parseInt(String(prevFrame?.id || "0"));
  const angleDirection = prevFrameId < crtFrameId ? [-finalAngle, 0] : [0, -finalAngle]
  const { rotateSpring } = useSpring({
    from: { rotateSpring: crtFrameId - 1 },
    to: { rotateSpring: crtFrameId },
    config: { duration: animationDuration },
  });
  const rotationProps = to(
    [
      rotateSpring
        .to([prevFrameId, crtFrameId], angleDirection)
        .to((x) => x),
    ],
    (x) => x
  );
  const svgRotationProps = to(
    [
      rotateSpring
        .to(
          [prevFrameId, crtFrameId],
          [prevSprite?.rotation + finalAngle, rotation]
        )
        .to((x) => x),
    ],
    (x) => x
  );

  // CHOOSE THE PROPS
  let animationProps = {};
  let svgProps = { ...scaleProps, ...opacityProps };

  console.log("Animation Type: ", animationType)
  console.log("Animation Props: ", spriteAnimationProps)

  if (animationType === "LINEAR") {
    animationProps = { ...animationProps, ...linearProps };
  } else if (animationType === "CHAOTIC") {
    animationProps = { ...animationProps, ...chaoticProps };
  } else if (animationType === "CIRCULAR") {
    // CIRCULAR PROPS
    const { distX, distY, circleX, circleY } = spriteAnimationProps;
    animationProps = { ...animationProps, x: circleX, y: circleY, rotation: rotationProps };
    // svgProps = circularSvgProps
    svgProps = {
      ...svgProps,
      x: -distX,
      y: -distY,
      rotation: svgRotationProps,
    };
  } else {
    animationProps = { ...animationProps, x: position.x, y: position.y };
  }

  const img = new window.Image();
  img.src = require(`../assets/cells/${backgroundUrl}.svg`);

  return (
    <animated.Group width={1} height={1} {...animationProps}>
      <animated.Image
        image={img}
        offsetX={width / 2}
        offsetY={height / 2}
        {...svgProps}
      />
    </animated.Group>
  );
}
