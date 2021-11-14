import { useTheme } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { drawerWidth } from '../../constants';
import { addSprite, updateCurrentSpritePosition } from '../../Frames/actions';
import { Sprite } from '../../Frames/reducers/frames';
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
  const canvasContainer = useRef<any>(null)
  const innerCanvas = useRef<any>(null)

  const smallDrawerWidth = theme.spacing(6)
  const headerHeight = theme.spacing(8)

  const canvasWidth = `calc(100vw - ${(isPropertiesSidebarOpen ? drawerWidth : smallDrawerWidth) + (isSpritesSidebarOpen ? drawerWidth : smallDrawerWidth)}px)`

  const containerStyle: any = {
    flexGrow: 1, 
    height: `calc(100vh - ${headerHeight + smallDrawerWidth}px)`,
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

  function updateSpritePosition(id: string, deltaX: number | undefined, deltaY: number | undefined) {
    dispatch(updateCurrentSpritePosition(id, deltaX, deltaY))
  }

  const [{isOver}, drop] = useDrop(({
    accept: 'SPRITE',
    drop: (item: any, monitor) => {
      if (item.type === 'SIDEBAR_SPRITE'){
        const containersWidthSpacing = Math.round((canvasContainer.current?.clientWidth - innerCanvas.current?.clientWidth * scale) / 2)
        const containersHeightSpacing = Math.round((canvasContainer.current?.clientHeight - innerCanvas.current?.clientHeight * scale) / 2)
        createSprite({
          x: Math.round(Math.round((monitor.getSourceClientOffset()?.x || 0) - containersWidthSpacing - drawerWidth) / scale),
          y: Math.round(Math.round((monitor.getSourceClientOffset()?.y || 0) - containersHeightSpacing - headerHeight) / scale)
        }, item.backgroundUrl)
      } else {
        const deltaX = Math.round((monitor.getDifferenceFromInitialOffset()?.x || 0) / scale)
        const deltaY = Math.round((monitor.getDifferenceFromInitialOffset()?.y || 0) / scale)
        updateSpritePosition(item.id, deltaX, deltaY)
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
    if (event.metaKey) {
      event.preventDefault()
      if (event.deltaY !== prevDelta) {
        setPrevDelta((currentPrevDelta) => {
          if (event.deltaY < 0 && event.deltaY !== currentPrevDelta) {
            dispatch(zoomIn())
          } 
          if (event.deltaY > 0 && event.deltaY !== currentPrevDelta) {
            dispatch(zoomOut())
          }
          return event.deltaY
        })
      }
    }
  }, {passive: false});

  return (
    <div ref={canvasContainer} style={{...containerStyle, transition: 'all 0.3s ease-out'}} id="main-canvas">
      <div ref={drop} style={{width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'scroll'}}>
        <div ref={innerCanvas} style={{...canvasStyle, backgroundColor: (isOver ? '#eee' : '#fff'), transform: `scale(${scale})`}}>
          {sprites.map((s: Sprite) => (
            <BaseSprite key={`sprite-${s.id}`} id={s.id} position={s.position} backgroundUrl={s.backgroundUrl} 
              scale={s.scale} duration={s.duration} 
              minTravelDistance={s.minTravelDistance} rangeOfMovement={s.rangeOfMovement} nrOfIterations={s.nrOfIterations} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnimationCanvas;
