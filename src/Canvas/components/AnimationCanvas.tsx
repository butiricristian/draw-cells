import { CircularProgress, useTheme } from '@mui/material';
import { get, ref, update } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { leftDrawerWidth } from '../../constants';
import { db } from '../../firebase-config';
import { addSprite, loadInitialData, setIsFramesSaving, updateCurrentSpritePosition } from '../../Frames/actions';
import { Sprite } from '../../Frames/reducers/frames';
import Header from '../../Header/components/CanvasHeader';
import PresentationModal from '../../Presentation/components/PresentationModal';
import FramesSidebar from '../../Sidebars/components/FramesSidebar';
import PropertiesSidebar from '../../Sidebars/components/PropertiesSidebar';
import SpritesSidebar from '../../Sidebars/components/SpritesSidebar';
import BaseSprite from '../../Sprites/BaseSprite';
import State from '../../stateInterface';
import { zoomIn, zoomOut } from '../actions';
import { CustomDragLayer } from './CustomDragLayer';

export default function AnimationCanvasContainer() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Header />
      <div className="App">
        <CustomDragLayer/>
        <AnimationCanvas />
        <SpritesSidebar />
        <FramesSidebar />
        <PropertiesSidebar/>
      </div>
      <PresentationModal />
    </DndProvider>
  )
}

function AnimationCanvas() {
  const dispatch = useDispatch()
  const sprites = useSelector((state: State) => state.frames.currentFrame.sprites)
  const lastSpriteId = useSelector((state: State) => state.frames.lastSpriteId)
  const theme = useTheme()
  const isSpritesSidebarOpen = useSelector((state: State) => state.sidebars.isSpritesOpen)
  const scale = useSelector((state: State) => state.canvas.scale)
  const canvasContainer = useRef<any>(null)
  const innerCanvas = useRef<any>(null)
  const framesList = useSelector((state: State) => state.frames.frames)
  const { presentationId } = useParams()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const getData = async () => {
      const res = await get(ref(db, `presentations/${presentationId}`))
      dispatch(loadInitialData(res.val()))
      setIsLoading(false)
    }
    getData()
  }, [presentationId, dispatch])

  useEffect(() => {
    dispatch(setIsFramesSaving(true))
    const t = setTimeout(async () => {
      const res = await update(ref(db), {[`presentations/${presentationId}/frames`]: framesList})
      dispatch(setIsFramesSaving(false))
      console.log(res)
    }, 2000)
    return () => {
      clearTimeout(t)
    }
  }, [framesList, presentationId, dispatch])

  const smallDrawerWidth: number = parseInt(theme.spacing(6).replace('px', ''))
  const headerHeight: number = parseInt(theme.spacing(8).replace('px', ''))

  const canvasWidth = `calc(100vw - ${smallDrawerWidth + (isSpritesSidebarOpen ? leftDrawerWidth : smallDrawerWidth)}px)`

  const containerStyle: any = {
    flexGrow: 1,
    height: `calc(100vh - ${headerHeight + smallDrawerWidth}px)`,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: (isSpritesSidebarOpen ? leftDrawerWidth : smallDrawerWidth),
    marginRight: smallDrawerWidth,
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
      dispatch(addSprite({id: lastSpriteId, position: pos, backgroundUrl}))
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
          x: Math.round(Math.round((monitor.getSourceClientOffset()?.x || 0) - containersWidthSpacing - leftDrawerWidth) / scale),
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

  if(isLoading) {
    return (<CircularProgress />)
  }

  return (
    <div ref={canvasContainer} style={{...containerStyle, transition: 'all 0.3s ease-out'}} id="main-canvas">
      <div ref={drop} style={{width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'scroll'}}>
        <div ref={innerCanvas} style={{...canvasStyle, backgroundColor: (isOver ? '#eee' : '#fff'), transform: `scale(${scale})`}}>
          {sprites.map((s: Sprite) => (
            <BaseSprite key={`sprite-${s.id}`} id={s.id} position={s.position} backgroundUrl={s.backgroundUrl}
              scale={s.scale} duration={s.duration}
              minTravelDistance={s.minTravelDistance} rangeOfMovement={s.rangeOfMovement} nrOfIterations={s.nrOfIterations}
              zIndex={s.zIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
