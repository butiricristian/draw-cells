import { useTheme } from '@material-ui/core';
import React from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { drawerWidth } from '../constants';
import { addSprite, updateCurrentSpritePosition } from '../Frames/actions';
import { Position, Sprite } from '../Frames/reducers/frames';
import BaseSprite from '../Sprites/BaseSprite';
import State from '../stateInterface';

function AnimationCanvas() {
  const dispatch = useDispatch()
  const sprites = useSelector((state: State) => state.frames.currentFrame.sprites)
  const theme = useTheme()
  const isFramesSidebarOpen = useSelector((state: State) => state.sidebars.isFramesOpen)
  const isSpritesSidebarOpen = useSelector((state: State) => state.sidebars.isSpritesOpen)
  const isPropertiesSidebarOpen = useSelector((state: State) => state.sidebars.isPropertiesOpen)

  const smallDrawerWidth = theme.spacing(6)
  const headerHeight = theme.spacing(8)

  const containerStyle: any = {
    flexGrow: 1, 
    height: `calc(100vh - ${headerHeight + (isFramesSidebarOpen ? drawerWidth : smallDrawerWidth)}px)`,
    display: 'flex', 
    flexDirection: 'column',
    marginLeft: (isSpritesSidebarOpen ? drawerWidth : smallDrawerWidth),
    marginRight: (isPropertiesSidebarOpen ? drawerWidth : smallDrawerWidth),
    width: `calc(100vw - ${(isPropertiesSidebarOpen ? drawerWidth : smallDrawerWidth) + (isSpritesSidebarOpen ? drawerWidth : smallDrawerWidth)}px)`,
  }

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
        createSprite({
          x: Math.round((monitor.getSourceClientOffset()?.x || 0) - drawerWidth),
          y: Math.round((monitor.getSourceClientOffset()?.y || 0) - headerHeight)
        }, item.backgroundUrl)
      } else {
        const pos: Position = {
          x: Math.round(item.x + monitor.getDifferenceFromInitialOffset()?.x || 0),
          y: Math.round(item.y + monitor.getDifferenceFromInitialOffset()?.y || 0)
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
    <div style={{...containerStyle, transition: 'all 0.3s ease-out'}} id="main-canvas">
      <div ref={drop} style={{flexGrow: 1, backgroundColor: (isOver ? '#d7d7d7' : '#fff'), position: 'relative'}}>
        {sprites.map((s: Sprite) => (
          <BaseSprite key={`sprite-${s.id}`} id={s.id} position={s.position} backgroundUrl={s.backgroundUrl} scale={s.scale} />
        ))}
      </div>
    </div>
  );
}

export default AnimationCanvas;
