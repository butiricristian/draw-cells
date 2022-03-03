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

function getRndInteger(min: number, max: number): number {
  return (Math.floor(Math.random() * (max - min) ) + min);
}

interface AnimationSpriteProps extends Sprite {
  canvas: HTMLElement | null,
  opacity?: number,
  initialOpacity?: number
}

export default function AnimationSprite({position, id, backgroundUrl, animationType, scale, canvas,
  minTravelDistance = 15, rangeOfMovement = 40, nrOfIterations = 10, duration = 1, circleDirection = 1,
  angle = 90, opacity, initialOpacity}: AnimationSpriteProps) {
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
  const linearProps: any = useSpring({to: {left: position.x, top: position.y}, config: {duration: animationDuration}})

  // CHAOTIC PROPS
  const chaoticArray = []
  let newLeft = prevSprite?.position.x || 0
  const leftDistance = position?.x - newLeft
  let newTop = prevSprite?.position.y || 0
  const topDistance = position?.y - newTop

  const finalMinTravelDistance = (isGoingBackwards ? prevSprite?.minTravelDistance : minTravelDistance) || 15
  const rangeOfMotion = (isGoingBackwards ? prevSprite?.rangeOfMovement : rangeOfMovement) || 40
  const numberOfIterations = (isGoingBackwards ? prevSprite?.nrOfIterations : nrOfIterations) || 10

  const leftStep = leftDistance / numberOfIterations
  const topStep = topDistance / numberOfIterations

  for(let i=0;i<numberOfIterations;i+=1){
    chaoticArray.push({left: newLeft, top: newTop})
    if (canvas) {
      let newRandLeft
      const fromIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*i)
      const toIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*(i+1))
      do {
        const fromLeft = fromIntermediaryLeftPoint-rangeOfMotion
        const toLeft = toIntermediaryLeftPoint+rangeOfMotion
        newRandLeft = getRndInteger(fromLeft, toLeft)
      } while(Math.abs(newLeft - newRandLeft) < finalMinTravelDistance)
      newLeft = newRandLeft

      let newRandTop
      const fromIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*i)
      const toIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*(i+1))
      do {
        const fromTop = fromIntermediaryTopPoint-rangeOfMotion
        const toTop = toIntermediaryTopPoint+rangeOfMotion
        newRandTop = getRndInteger(fromTop, toTop)
      } while(Math.abs(newTop - newRandTop) < finalMinTravelDistance)
      newTop = newRandTop
    } else {
      newLeft = 0
      newTop = 0
    }
  }
  chaoticArray.push({left: position.x, top: position.y})
  const chaoticProps: any = useSpring({to: chaoticArray, config: {duration: animationDuration/nrOfIterations}})


  // CIRCULAR PROPS
  const currentCircleDirection: number = isGoingBackwards ? prevSprite?.circleDirection || 1 : circleDirection
  const currentAngle: number = isGoingBackwards ? prevSprite?.angle || 90 : angle
  const [x1, y1, x2, y2] = [prevSprite?.position.x || 0, prevSprite?.position.y || 0, position.x, position.y]
  const pointsDistance = Math.round(Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))*100)/100
  const radius = Math.round((pointsDistance / 2) / (Math.sin((currentAngle/2) * (Math.PI/180)))*100)/100

  const m = Math.round((x1 - x2) / (y2 - y1) * 100)/100
  const x3 = (x1+x2)/2
  const y3 = (y1+y2)/2
  const a = Math.round((m*m + 1)*100)/100
  const b = Math.round((-2 * (x1 + y1*m - y3*m + m*m*x3)) * 100)/100
  const c = Math.round((x1*x1 + y1*y1 + 2*y1*(m*x3-y3) + m*m*x3*x3 + y3*y3 - 2*m*x3*y3 - radius*radius)*100)/100
  const delta = Math.round((b*b - 4*a*c)*100)/100
  const circleX = Math.round((-b + currentCircleDirection * Math.sqrt(delta)) / (2*a))
  const circleY = Math.round(m*circleX - m*x3 + y3)
  const distX = (circleX - x2)
  const distY = (circleY - y2)

  const angleDirection = (y1 > y2) ? -1 : 1
  const finalAngle = currentAngle * angleDirection * currentCircleDirection

  const crtFrameId = parseInt(String(currentFrame.id || '1'))
  const { rotateSpring } = useSpring({
    from: {
      rotateSpring: crtFrameId - 1
    },
    to: {
      rotateSpring: crtFrameId,
    },
    config: {
      duration: animationDuration
    }
  })
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
      props = {...props, left: circleX, top: circleY, transform: rotateSpring.to([crtFrameId - 1, crtFrameId], [finalAngle, 0]).to((x: any) => `rotate(${x}deg)`)}
      svgProps = {transform: `translate(${-distX}px, ${-distY}px)`}
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