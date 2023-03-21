import React from "react";
import { animated, to, useSpring } from "@react-spring/konva";

function getCurrentAndPrevSprite(animationProps) {
  const {currentFrame, prevFrame, id} = animationProps
  const isGoingBackwards = (currentFrame.id || 0) < (prevFrame?.id || 0);
  const prevSprite = prevFrame?.sprites.find((s) => s.id === id);
  const currentSprite = animationProps

  if (!prevSprite) {
    return [currentSprite]
  }

  if (isGoingBackwards) {
    return [currentSprite, prevSprite]
  }
  return [prevSprite, currentSprite]
}

export default function AnimationSprite(props) {
  const [currentSprite, prevSprite] = getCurrentAndPrevSprite(props)
  const { currentFrame } = props

  console.log(currentSprite, prevSprite)

  const {
    position,
    backgroundUrl,
    animationType,
    scale,
    width,
    height,
    rotation,
    nrOfIterations = 10,
    duration = 1,
    opacity,
    animationProps: spriteAnimationProps,
  } = currentSprite

  const animationDuration = (duration || 1) * 1000;
    // ((isGoingBackwards ? duration : prevSprite?.duration) || 1) * 1000;
  const currentNrOfIterations = nrOfIterations || 10
    // (isGoingBackwards ? nrOfIterations : prevSprite?.nrOfIterations) || 10;

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
    to: spriteAnimationProps,
    config: { duration: animationDuration },
  });

  // CHAOTIC PROPS
  const chaoticProps = useSpring({
    to: spriteAnimationProps,
    config: {
      duration:
        Math.round((animationDuration / currentNrOfIterations) * 100) / 100,
    },
  });

  // CIRCULAR PROPS
  const { distX, distY, finalAngle, circleX, circleY } = spriteAnimationProps;
  const crtFrameId = parseInt(String(currentFrame.id || "1"));
  const { rotateSpring } = useSpring({
    from: { rotateSpring: crtFrameId - 1 },
    to: { rotateSpring: crtFrameId },
    config: { duration: animationDuration },
  });
  const rotationProps = to(
    [
      rotateSpring
        .to([crtFrameId - 1, crtFrameId], [-finalAngle, 0])
        .to((x) => x),
    ],
    (x) => x
  );
  const svgRotationProps = to(
    [
      rotateSpring
        .to(
          [crtFrameId - 1, crtFrameId],
          [prevSprite?.rotation + finalAngle, rotation]
        )
        .to((x) => x),
    ],
    (x) => x
  );

  // CHOOSE THE PROPS
  // const currentAnimationType = isGoingBackwards
  //   ? animationType
  //   : prevSprite?.animationType;
  const currentAnimationType = animationType
  let animationProps = {};
  let svgProps = { ...scaleProps, ...opacityProps };
  if (
    prevSprite &&
    prevSprite.position.x !== position.x &&
    prevSprite.position.y !== position.y
  ) {
    if (currentAnimationType === "LINEAR") {
      animationProps = { ...animationProps, ...linearProps };
    } else if (currentAnimationType === "CHAOTIC") {
      animationProps = { ...animationProps, ...chaoticProps };
    } else if (currentAnimationType === "CIRCULAR") {
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
