import { useTheme } from '@material-ui/core';
import React from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { addSprite, updateCurrentSpritePosition } from '../Frames/actions';
import { Position, Sprite } from '../Frames/reducers/frames';
import BaseSprite from '../Sprites/BaseSprite';
import State from '../stateInterface';

function AnimationCanvas() {
  const dispatch = useDispatch()
  const sprites = useSelector((state: State) => state.frames.currentFrame.sprites)
  const theme = useTheme()

  function createSprite(pos: XYCoord | null, backgroundUrl: string){
    if (pos) {
      dispatch(addSprite({id: sprites.length + 1, position: pos, backgroundUrl}))
    }
  }

  function updateSpritePosition(id: string, pos: Position) {
    dispatch(updateCurrentSpritePosition(id, pos))
  }

  const [{isOver}, drop] = useDrop(({
    accept: 'SPRITE',
    drop: (item: any, monitor) => {
      if (item.type === 'SIDEBAR_SPRITE'){
        createSprite(monitor.getSourceClientOffset(), item.backgroundUrl)
      } else {
        const pos: Position = {
          x: item.x + monitor.getDifferenceFromInitialOffset()?.x || 0, 
          y: item.y + monitor.getDifferenceFromInitialOffset()?.y || 0
        }
        updateSpritePosition(item.id, pos)
        return undefined
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }))

  return (
    <div style={{flexGrow: 1, height: `calc(100vh - ${theme.spacing(8)}px)`, display: 'flex', flexDirection: 'column'}} id="main-canvas">
      <div ref={drop} style={{flexGrow: 1, backgroundColor: (isOver ? '#d7d7d7' : '#fff')}}>
        {sprites.map((s: Sprite) => (
          <BaseSprite key={`sprite-${s.id}`} id={s.id} position={s.position} backgroundUrl={s.backgroundUrl} />
        ))}
      </div>
    </div>
  );
}

export default AnimationCanvas;
