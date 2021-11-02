import { useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { drawerWidth } from '../../constants';
import { addSprite, updateCurrentSpritePosition } from '../../Frames/actions';
import { Position, Sprite } from '../../Frames/reducers/frames';
import BaseSprite from '../../Sprites/BaseSprite';
import State from '../../stateInterface';
import { zoomIn, zoomOut } from '../actions';

function AnimationCanvas() {
  const dispatch = useDispatch()
  const sprites = useSelector((state: State) => state.frames.currentFrame.sprites)
  const theme = useTheme()
  const isFramesSidebarOpen = useSelector((state: State) => state.sidebars.isFramesOpen)
  const isSpritesSidebarOpen = useSelector((state: State) => state.sidebars.isSpritesOpen)
  const isPropertiesSidebarOpen = useSelector((state: State) => state.sidebars.isPropertiesOpen)
  const scale = useSelector((state: State) => state.canvas.scale)
  console.log(scale)

  const smallDrawerWidth = theme.spacing(6)
  const headerHeight = theme.spacing(8)

  const canvasWidth = `calc(100vw - ${(isPropertiesSidebarOpen ? drawerWidth : smallDrawerWidth) + (isSpritesSidebarOpen ? drawerWidth : smallDrawerWidth)}px)`

  const containerStyle: any = {
    flexGrow: 1, 
    height: `calc(100vh - ${headerHeight + (isFramesSidebarOpen ? drawerWidth : smallDrawerWidth)}px)`,
    display: 'flex', 
    flexDirection: 'column',
    marginLeft: (isSpritesSidebarOpen ? drawerWidth : smallDrawerWidth),
    marginRight: (isPropertiesSidebarOpen ? drawerWidth : smallDrawerWidth),
    width: canvasWidth,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  }

  const canvasStyle: any = {
    height: '90%',
    width: '90%',
    border: 'solid 1px #ddd',
    position: 'relative',
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
    collect: (monitor) => {
      const item: any = monitor.getItem()
      return {
        isOver: (item?.type || '') === 'SIDEBAR_SPRITE' && !!monitor.isOver(),
      }
    }
  }))

  const [prevDelta, setPrevDelta] = useState(0)

  window.addEventListener("wheel", function(event){
    event.preventDefault()
    if (event.deltaY !== prevDelta) {
      setPrevDelta((currentPrevDelta) => {
        if (event.deltaY < 0 && event.deltaY !== currentPrevDelta && event.metaKey) {
          console.log('Should zoom in now')
          dispatch(zoomIn())
        } 
        if (event.deltaY > 0 && event.deltaY !== currentPrevDelta && event.metaKey) {
          console.log('Should zoom out now')
          dispatch(zoomOut())
        }
        return event.deltaY
      })
    }
  }, {passive: false});

  return (
    <div ref={drop} style={{...containerStyle, transition: 'all 0.3s ease-out', overflow: 'scroll'}} id="main-canvas">
      <div style={{...canvasStyle, backgroundColor: (isOver ? '#eee' : '#fff'), transform: `scale(${scale})`}}>
        {sprites.map((s: Sprite) => (
          <BaseSprite key={`sprite-${s.id}`} id={s.id} position={s.position} backgroundUrl={s.backgroundUrl} scale={s.scale} />
        ))}
      </div>
    </div>
  );
}

export default AnimationCanvas;
