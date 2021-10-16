import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDrag } from 'react-dnd';

interface SidebarSpriteProps {
  backgroundUrl: string,
  name: string,
}

const useStyles = makeStyles({
  sprite: {
    width: 50, 
    height: 50, 
    cursor: 'pointer',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  spriteContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5 ,
    flexDirection: 'column'
  }
})

export default function SidebarSprite({backgroundUrl, name}: SidebarSpriteProps) {
  const classes = useStyles()
  
  const [{isDragging: isSquareDragging}, squareDrag] = useDrag(() => ({
    type: 'SPRITE',
    item: { type: 'SIDEBAR_SPRITE', backgroundUrl },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div className={classes.spriteContainer}>
      <div 
        ref={squareDrag}
        className={classes.sprite}
        style={{opacity: isSquareDragging ? 0.5 : 1, backgroundImage: `url('/assets/${backgroundUrl}.svg')`}}
      />
      <Typography variant="body2">{name}</Typography>
    </div>
  );
}