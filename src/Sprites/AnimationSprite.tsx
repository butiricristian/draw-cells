import { makeStyles } from '@material-ui/core';
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
    }
  },
  spriteContainer: {
    position: 'absolute',
    cursor: 'pointer',
    width: 50,
    height: 50, 
  }
})

function getRndInteger(min: number, max: number): number {
  return (Math.floor(Math.random() * (max - min) ) + min);
}

interface AnimationSpriteProps extends Sprite {
  canvas: HTMLElement | null,
}

export default function AnimationSprite({position, id, backgroundUrl, animationType, scale, canvas, 
  minTravelDistance = 15, rangeOfMovement = 40, nrOfIterations = 10, duration = 1}: AnimationSpriteProps) {
  const classes = useStyles()
  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const prevFrame = useSelector((state: State) => state.frames.prevFrame)
  const prevSprite = prevFrame?.sprites.find(s => s.id === id)
  const animationDuration = (((currentFrame.id || '') >= (prevFrame?.id || '') ? prevSprite?.duration : duration) || 1) * 1000

  //SCALE PROPS
  const scaleProps: any = useSpring({to: {transform: `scale(${scale})`}})

  // OPACITY PROPS
  const opacityProps: any = useSpring({from: {opacity: 0}, to: {opacity: 1}})
  
  // LINEAR PROPS
  const linearProps: any = useSpring({to: {left: position.x, top: position.y}, config: {duration: animationDuration}})

  // CHAOTIC PROPS
  const chaoticArray = []
  let newLeft = prevSprite?.position.x || 0
  const leftDistance = position?.x - newLeft
  let newTop = prevSprite?.position.y || 0
  const topDistance = position?.y - newTop

  console.log("newLeft: ", newLeft, "leftDistance: ", leftDistance)

  const finalMinTravelDistance = ((currentFrame.id || '') >= (prevFrame?.id || '') ? prevSprite?.minTravelDistance : minTravelDistance) || 15
  const rangeOfMotion = ((currentFrame.id || '') >= (prevFrame?.id || '') ? prevSprite?.rangeOfMovement : rangeOfMovement) || 40
  const numberOfIterations = ((currentFrame.id || '') >= (prevFrame?.id || '') ? prevSprite?.nrOfIterations : nrOfIterations) || 10
  
  console.log("Duration: ", animationDuration)
  console.log("Travel distance:", prevSprite?.minTravelDistance, ", Range of Motion: ", prevSprite?.rangeOfMovement, ", Nr Iterations: ", prevSprite?.nrOfIterations)

  const leftStep = leftDistance / numberOfIterations
  const topStep = topDistance / numberOfIterations

  for(let i=0;i<numberOfIterations;i+=1){
    chaoticArray.push({left: newLeft, top: newTop})
    if (canvas) {
      let newRandLeft
      const fromIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*i)
      const toIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*(i+1))
      console.log("From: ", fromIntermediaryLeftPoint, " To: ", toIntermediaryLeftPoint)
      do {
        const fromLeft = fromIntermediaryLeftPoint-rangeOfMotion
        const toLeft = toIntermediaryLeftPoint+rangeOfMotion
        newRandLeft = getRndInteger(fromLeft, toLeft)
        console.log("newLeft: ", newLeft, " newRandLeft: ", newRandLeft, "finalMinTravelDistance: ", finalMinTravelDistance)
      } while(Math.abs(newLeft - newRandLeft) < finalMinTravelDistance)
      newLeft = newRandLeft

      let newRandTop
      const fromIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*i)
      const toIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*(i+1))
      console.log("From: ", fromIntermediaryTopPoint, " To: ", toIntermediaryTopPoint)
      do {
        const fromTop = fromIntermediaryTopPoint-rangeOfMotion
        const toTop = toIntermediaryTopPoint+rangeOfMotion
        newRandTop = getRndInteger(fromTop, toTop)
        console.log("newLeft: ", newTop, " newRandLeft: ", newRandTop, "finalMinTravelDistance: ", finalMinTravelDistance)
      } while(Math.abs(newTop - newRandTop) < finalMinTravelDistance)
      newTop = newRandTop
    } else {
      newLeft = 0
      newTop = 0
    }
  }
  chaoticArray.push({left: position.x, top: position.y})
  const chaoticProps: any = useSpring({to: chaoticArray, config: {duration: animationDuration/nrOfIterations}})

  const currentAnimationType = (currentFrame.id || '') >= (prevFrame?.id || '') ? prevSprite?.animationType : animationType

  // CHOOSE THE PROPS
  let props = scaleProps
  if (prevSprite) {
    if (currentAnimationType === 'LINEAR') {
      props = {...props, ...linearProps}
    } else if (currentAnimationType === 'CHAOTIC') {
      props = {...props, ...chaoticProps}
    } else {
      props = {...props, left: position.x, top: position.y}
    }
  } else {
    props = {...opacityProps, ...linearProps, ...scaleProps}
  }
  
  return (
    <animated.div className={classes.spriteContainer} style={props}>
      <div 
        className={clsx(classes.sprite)}
        style={{backgroundColor: 'transparent'}}
      >
        {backgroundUrl && spriteToSvgMap[backgroundUrl]}
      </div>
    </animated.div>
  );
}