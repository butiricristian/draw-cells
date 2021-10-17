import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { SPRITE_TO_SVG_ELEMENT_MAP } from '../constants';
import { Sprite } from '../Frames/reducers/frames';
import {animated, useSpring} from 'react-spring'

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

export default function AnimationSprite({position, id, backgroundUrl}: Sprite) {
  const classes = useStyles()

  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP
  const props: any = useSpring({to: {left: position.x, top: position.y}})
  
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