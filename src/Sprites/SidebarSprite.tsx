import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useDrag } from 'react-dnd';

interface SidebarSpriteProps {
  backgroundUrl: string
}

const useStyles = makeStyles({
  sprite: {width: 50, height: 50, cursor: 'pointer'}
})

export default function SidebarSprite({backgroundUrl}: SidebarSpriteProps) {
  const classes = useStyles()
  
  const [{isDragging: isSquareDragging}, squareDrag] = useDrag(() => ({
    type: 'SPRITE',
    item: { type: 'SQUARE' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div 
      ref={squareDrag}
      className={classes.sprite}
      style={{opacity: isSquareDragging ? 0.5 : 1, background: `url('/assets/${backgroundUrl}.svg')`, backgroundSize: 'cover'}} />
  );
}