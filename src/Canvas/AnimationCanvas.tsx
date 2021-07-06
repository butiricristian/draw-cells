import { useTheme } from '@material-ui/core';
import React from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addSprite } from '../Frames/actions';
import { Sprite } from '../Frames/reducers/frames';
import BaseSprite from '../Sprites/BaseSprite';
import State from '../stateInterface';

function AnimationCanvas() {
  const dispatch = useDispatch()
  const sprites = useSelector((state: State) => state.frames.currentFrame.sprites)
  console.log(sprites)  
  const theme = useTheme()

  function createSprite(pos: XYCoord | null){
    if (pos) {
      dispatch(addSprite({id: sprites.length + 1, position: pos}))
    }
  }

  const [{isOver}, drop] = useDrop(({
    accept: 'SPRITE',
    drop: (_, monitor) => createSprite(monitor.getSourceClientOffset()),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }))

  return (
    <div style={{flexGrow: 1, height: `calc(100vh - ${theme.spacing(8)}px)`, display: 'flex', flexDirection: 'column'}}>
      <div ref={drop} style={{flexGrow: 1, backgroundColor: (isOver ? '#d7d7d7' : '#fff')}}>
        {sprites.map((s: Sprite) => (
          <BaseSprite key={`sprite-${s.id}`} id={s.id} position={s.position} />
        ))}
      </div>
    </div>
  );
}

export default AnimationCanvas;
