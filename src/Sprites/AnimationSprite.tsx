import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { SPRITE_TO_SVG_ELEMENT_MAP } from '../constants';
import { Sprite } from '../Frames/reducers/frames';
import {animated, useSpring} from 'react-spring'
import { useSelector } from 'react-redux';
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

export default function AnimationSprite({position, id, backgroundUrl, animationType}: Sprite) {
  const classes = useStyles()
  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const prevFrame = useSelector((state: State) => state.frames.prevFrame)
  const prevSprite = prevFrame?.sprites.find(s => s.id === id)

  // OPACITY PROPS
  const opacityProps: any = useSpring({from: {opacity: 0}, to: {opacity: 1}})
  
  // LINEAR PROPS
  const linearProps: any = useSpring({to: {left: position.x, top: position.y}, config: {duration: 1000}})

  // CHAOTIC PROPS
  const chaoticArray = []
  let newLeft = prevSprite?.position.x || 0
  let newTop = prevSprite?.position.y || 0
  const direction = (prevSprite?.position.x || 0) < position.x ? 1 : -1
  const distance = Math.abs((prevSprite?.position.x || 0) - position.x)
  for(let i=0;i<10;i+=1){
    chaoticArray.push({left: newLeft, top: newTop})
    newLeft += Math.round(distance/10)*direction
    newTop += 200*(i%2 === 0 ? -1 : 1)
  }
  chaoticArray.push({left: position.x, top: position.y})
  const chaoticProps: any = useSpring({to: chaoticArray, config: {duration: 200}})

  const currentAnimationType = (currentFrame.id || '') >= (prevFrame?.id || '') ? prevSprite?.animationType : animationType

  // CHOOSE THE PROPS
  let props = {}
  if (prevSprite) {
    if (currentAnimationType === 'LINEAR') {
      props = linearProps
    } else if (currentAnimationType === 'CHAOTIC') {
      props = chaoticProps
    } else {
      props = {left: position.x, top: position.y}
    }
  } else {
    props = {...opacityProps, ...linearProps}
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