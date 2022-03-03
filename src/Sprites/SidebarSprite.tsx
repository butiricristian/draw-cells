import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { SPRITE_TO_SVG_ELEMENT_MAP } from '../constants';

interface SidebarSpriteProps {
  backgroundUrl: string,
  name: string,
}

const useStyles = makeStyles({
  sprite: {
    width: 50, 
    height: 50, 
    cursor: 'pointer',
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
  
  const [{isDragging: isSquareDragging}, squareDrag, preview] = useDrag(() => ({
    type: 'SPRITE',
    item: { type: 'SIDEBAR_SPRITE', backgroundUrl },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP

  return (
    <div className={classes.spriteContainer}>
      <div 
        ref={squareDrag}
        className={classes.sprite}
        style={{opacity: isSquareDragging ? 0.5 : 1}}
      >
        {backgroundUrl && spriteToSvgMap[backgroundUrl]}
      </div>
      <Typography variant="body2">{name}</Typography>
    </div>
  );
}