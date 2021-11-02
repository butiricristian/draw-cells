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

export default function AnimationSprite({position, id, backgroundUrl, animationType, scale, canvas}: AnimationSpriteProps) {
  const classes = useStyles()
  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const prevFrame = useSelector((state: State) => state.frames.prevFrame)
  const prevSprite = prevFrame?.sprites.find(s => s.id === id)

  //SCALE PROPS
  const scaleProps: any = useSpring({to: {transform: `scale(${scale})`}})

  // OPACITY PROPS
  const opacityProps: any = useSpring({from: {opacity: 0}, to: {opacity: 1}})
  
  // LINEAR PROPS
  const linearProps: any = useSpring({to: {left: position.x, top: position.y}, config: {duration: 1000}})

  // CHAOTIC PROPS
  const chaoticArray = []
  let newLeft = prevSprite?.position.x || 0
  const leftDistance = position?.x - newLeft
  let newTop = prevSprite?.position.y || 0
  const topDistance = position?.y - newTop
  const minRangeOfMovement = 15
  const rangeOfMotion = 40
  const nrOfIterations = 30
  const duration = 3000
  const leftStep = leftDistance / nrOfIterations
  const topStep = topDistance / nrOfIterations

  for(let i=0;i<nrOfIterations;i+=1){
    chaoticArray.push({left: newLeft, top: newTop})
    if (canvas) {
      let newRandLeft
      const fromIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*i)
      const toIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*(i+1))
      console.log("From: ", fromIntermediaryLeftPoint, " To: ", toIntermediaryLeftPoint)
      do {
        newRandLeft = getRndInteger(Math.max(fromIntermediaryLeftPoint-rangeOfMotion, 0), Math.min(toIntermediaryLeftPoint+rangeOfMotion, canvas.clientWidth))
      } while(Math.abs(newLeft - newRandLeft) < minRangeOfMovement)
      newLeft = newRandLeft

      let newRandTop
      const fromIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*i)
      const toIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*(i+1))
      console.log("From: ", fromIntermediaryTopPoint, " To: ", toIntermediaryTopPoint)
      do {
        newRandTop = getRndInteger(Math.max(fromIntermediaryTopPoint-rangeOfMotion, 0), Math.min(toIntermediaryTopPoint+rangeOfMotion, canvas.clientHeight))
      } while(Math.abs(newTop - newRandTop) < minRangeOfMovement)
      newTop = newRandTop
    } else {
      newLeft = 0
      newTop = 0
    }
  }
  chaoticArray.push({left: position.x, top: position.y})
  const chaoticProps: any = useSpring({to: chaoticArray, config: {duration: duration/nrOfIterations}})

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