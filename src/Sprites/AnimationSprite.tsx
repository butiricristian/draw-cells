import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import { SPRITE_TO_SVG_ELEMENT_MAP } from '../constants';
import { Sprite } from '../Frames/reducers/frames';
import State from '../stateInterface';

const useStyles = makeStyles({
  sprite: {
    border: 'dashed 2px transparent',
    borderWidth: 2,
    width: '100%',
    height: '100%',
    margin: 3,
    '& svg': {
      height: '100%',
      width: '100%'
    },
  },
  spriteContainer: {
    position: 'absolute',
    cursor: 'pointer',
    width: 50,
    height: 50,
  },
  spriteContainerHidden: {
    opacity: 0,
  }
})

interface AnimationSpriteProps extends Sprite {
  canvas: HTMLElement | null,
  opacity?: number,
}

export default function AnimationSprite({position, id, backgroundUrl, animationType, scale, canvas,
  minTravelDistance = 15, rangeOfMovement = 40, nrOfIterations = 10, duration = 1, circleDirection = 1,
  angle = 90, opacity, animationProps}: AnimationSpriteProps) {
  const classes = useStyles()
  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const prevFrame = useSelector((state: State) => state.frames.prevFrame)
  const prevSprite = prevFrame?.sprites.find(s => s.id === id)
  const animationDuration = (((currentFrame.id || '') >= (prevFrame?.id || '') ? prevSprite?.duration : duration) || 1) * 1000
  const isGoingBackwards = (currentFrame.id || 0) >= (prevFrame?.id || 0)

  //SCALE PROPS
  const scaleProps: any = useSpring({to: {transform: `scale(${scale})`}})

  // OPACITY PROPS
  const opacityProps: any = useSpring({from: {opacity: 0}, to: {opacity: opacity}})

  // LINEAR PROPS
  const linearProps: any = useSpring({...animationProps, config: {duration: animationDuration}})

  // CHAOTIC PROPS
  const chaoticProps: any = useSpring({...animationProps, config: {duration: animationDuration/nrOfIterations}})


  // CIRCULAR PROPS
  const {distX, distY, finalAngle, circleX, circleY} = animationProps
  const crtFrameId = parseInt(String(currentFrame.id || '1'))
  const { rotateSpring } = useSpring({
    from: {rotateSpring: crtFrameId - 1},
    to: {rotateSpring: crtFrameId},
    config: { duration: animationDuration }
  })
  const circularProps = { left: circleX, top: circleY, transform: rotateSpring.to([crtFrameId - 1, crtFrameId], [finalAngle, 0]).to((x: any) => `rotate(${x}deg)`) }
  const circularSvgProps = {transform: `translate(${-distX}px, ${-distY}px)`}


  const currentAnimationType = isGoingBackwards ? prevSprite?.animationType : animationType

  // CHOOSE THE PROPS
  let props = scaleProps
  let svgProps = {}
  if (prevSprite) {
    if (currentAnimationType === 'LINEAR') {
      props = {...props, ...linearProps}
    } else if (currentAnimationType === 'CHAOTIC') {
      props = {...props, ...chaoticProps}
    } else if (currentAnimationType === 'CIRCULAR') {
      props = {...props, ...circularProps}
      svgProps = circularSvgProps
    } else {
      props = {...props, left: position.x, top: position.y}
    }
  } else {
    props = {...linearProps, ...scaleProps}
  }

  return (
    <animated.div className={clsx(classes.spriteContainer)} style={{...opacityProps, ...props}}>
      <div
        className={clsx(classes.sprite)}
        style={{backgroundColor: 'transparent', ...svgProps}}
      >
        {backgroundUrl && spriteToSvgMap[backgroundUrl]}
      </div>
    </animated.div>
  );
}