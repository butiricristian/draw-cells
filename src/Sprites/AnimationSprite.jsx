import React from 'react';
import { animated, to, useSpring } from '@react-spring/konva';
import { Frame, Sprite } from '../Frames/reducers/frames';

// const useStyles = makeStyles({
//   sprite: {
//     border: 'dashed 2px transparent',
//     borderWidth: 2,
//     width: '100%',
//     height: '100%',
//     margin: 3,
//     '& svg': {
//       height: '100%',
//       width: '100%'
//     },
//   },
//   spriteContainer: {
//     position: 'absolute',
//     cursor: 'pointer',
//     width: 50,
//     height: 50,
//   },
//   spriteContainerHidden: {
//     opacity: 0,
//   }
// })

interface AnimationSpriteProps extends Sprite {
  canvas: HTMLElement | null,
  opacity?: number,
  currentFrame: Frame,
  prevFrame: Frame | null,
}

export default function AnimationSprite({position, id, backgroundUrl, animationType, scale, width, height, rotation,
  nrOfIterations = 10, duration = 1, opacity, animationProps, zIndex, currentFrame, prevFrame}: AnimationSpriteProps) {

  const prevSprite = prevFrame?.sprites.find(s => s.id === id)
  const isGoingBackwards = (currentFrame.id || 0) < (prevFrame?.id || 0)
  const animationDuration = ((isGoingBackwards ? duration : prevSprite?.duration) || 1) * 1000
  const currentNrOfIterations = ((isGoingBackwards ? nrOfIterations : prevSprite?.nrOfIterations) || 10)

  //SCALE PROPS
  const scaleProps = useSpring({to: {scale, rotation, width, height}, config: {duration: animationDuration}})

  // OPACITY PROPS
  const opacityProps = useSpring({from: {opacity: 0}, to: {opacity: opacity}, config: {duration: 500}})

  // LINEAR PROPS
  const linearProps = useSpring({to: animationProps, config: {duration: animationDuration}})

  // CHAOTIC PROPS
  const chaoticProps = useSpring({to: animationProps, config: {duration: Math.round(animationDuration/currentNrOfIterations * 100) / 100}})

  // CIRCULAR PROPS
  const {distX, distY, finalAngle, circleX, circleY} = animationProps
  const crtFrameId = parseInt(String(currentFrame.id || '1'))
  const { rotateSpring } = useSpring({
    from: {rotateSpring: crtFrameId - 1},
    to: {rotateSpring: crtFrameId},
    config: { duration: animationDuration }
  })
  const rotationProps = to(
    [rotateSpring.to([crtFrameId - 1, crtFrameId], [finalAngle, 0]).to(x => x)],
    x => x
  )
  const svgRotationProps = to(
    [rotateSpring.to([crtFrameId - 1, crtFrameId], [prevSprite?.rotation-finalAngle, rotation]).to(x => x)],
    x => x
  )

  // CHOOSE THE PROPS
  const currentAnimationType = isGoingBackwards ? animationType : prevSprite?.animationType
  let props = {}
  let svgProps = {...scaleProps, ...opacityProps}
  if (prevSprite && prevSprite.position.x !== position.x && prevSprite.position.y !== position.y) {
    if (currentAnimationType === 'LINEAR') {
      props = {...props, ...linearProps}
    } else if (currentAnimationType === 'CHAOTIC') {
      props = {...props, ...chaoticProps}
    } else if (currentAnimationType === 'CIRCULAR') {
      props = {...props, x: circleX, y: circleY, rotation: rotationProps}
      // svgProps = circularSvgProps
      svgProps = {...svgProps, x: -distX, y: -distY, rotation: svgRotationProps}
    } else {
      props = {...props, x: position.x, y: position.y}
    }
  } else {
    props = {...props, x: position.x, y: position.y}
  }

  const img = new window.Image()
  img.src = require(`../assets/cells/${backgroundUrl}.svg`)

  return (
    <animated.Group width={1} height={1} {...props}>
      <animated.Image
        image={img}
        {...svgProps}
      />
    </animated.Group>
  )
}