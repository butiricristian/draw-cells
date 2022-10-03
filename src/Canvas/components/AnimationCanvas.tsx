import { CircularProgress, useTheme } from '@mui/material';
import { get, ref, update } from 'firebase/database';
import html2canvas from 'html2canvas';
import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layer, Stage } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { leftDrawerWidth } from '../../constants';
import { db } from '../../firebase-config';
import { addCurrentSprite, addSprite, loadInitialData, setCurrentSprite, setFramePreview, setIsFramesSaving, updateCurrentSpritePosition, updateSprite } from '../../Frames/actions';
import { Sprite } from '../../Frames/reducers/frames';
import Header from '../../Header/components/CanvasHeader';
import PresentationModal from '../../Presentation/components/PresentationModal';
import FramesSidebar from '../../Sidebars/components/FramesSidebar';
import PropertiesSidebar from '../../Sidebars/components/PropertiesSidebar';
import SpritesSidebar from '../../Sidebars/components/SpritesSidebar';
import CanvasSprite from '../../Sprites/CanvasSprite';
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
  const currentFrameId = useSelector((state: State) => state.frames.currentFrame.id)
  const lastSpriteId = useSelector((state: State) => state.frames.lastSpriteId)
  const theme = useTheme()
  const isSpritesSidebarOpen = useSelector((state: State) => state.sidebars.isSpritesOpen)
  const scale = useSelector((state: State) => state.canvas.scale)
  const canvasContainer = useRef<any>(null)
  const innerCanvas = useRef<any>(null)
  const framesList = useSelector((state: State) => state.frames.frames)
  const isAnimationPreviewModalOpen = useSelector((state: State) => state.presentations.isModalOpen)
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

  useEffect(() => {
    if (isAnimationPreviewModalOpen) return
    const t = setTimeout(async () => {
      const mainCanvas = document.getElementById('inner-canvas')
      if (!mainCanvas) return
      const canvas = await html2canvas(mainCanvas)
      if(currentFrameId) dispatch(setFramePreview(currentFrameId, canvas))
    }, 50)
    return () => {
      clearTimeout(t)
    }
  }, [sprites, currentFrameId, isAnimationPreviewModalOpen, dispatch])

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
      dispatch(addSprite({id: lastSpriteId, position: pos, backgroundUrl, height: 50, width: 50, rotation: 0}))
    }
  }

  function updateSpritePosition(id: string, deltaX: number | undefined, deltaY: number | undefined) {
    dispatch(updateCurrentSpritePosition(id, deltaX, deltaY))
  }

  const [{isOver}, drop] = useDrop(({
    accept: 'SPRITE',
    drop: (item: any, monitor) => {
      if (item.type === 'SIDEBAR_SPRITE'){
        const innerCanvasWidth = innerCanvas.current?.container().clientWidth
        const innerCanvasHeight = innerCanvas.current?.container().clientHeight
        const containersWidthSpacing = Math.round((canvasContainer.current?.clientWidth - innerCanvasWidth * scale) / 2)
        const containersHeightSpacing = Math.round((canvasContainer.current?.clientHeight - innerCanvasHeight * scale) / 2)
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

  const handleSelectSprite = (e: MouseEvent, id: number|string) => {
    if (e.metaKey) {
      dispatch(addCurrentSprite(id))
    } else {
      dispatch(setCurrentSprite(id))
    }
  }

  const [selectedSpriteId, setSelectedSpriteId] = useState<string|number|null>(null)

  if(isLoading) {
    return (<CircularProgress />)
  }

  return (
    <div ref={canvasContainer} style={{...containerStyle, transition: 'all 0.3s ease-out'}} id="main-canvas">
      <div ref={drop} style={{width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'scroll'}}>
        <Stage width={1920} height={1920} ref={innerCanvas} style={{...canvasStyle, backgroundColor: (isOver ? '#eee' : '#fff'), transform: `scale(${scale})`}}>
          <Layer>
            {sprites.map((s: Sprite) => (
              <CanvasSprite
                key={s.id}
                backgroundUrl={s.backgroundUrl}
                x={s.position.x}
                y={s.position.y}
                width={s.width}
                height={s.height}
                rotation={s.rotation}
                onChange={(props: any) => {
                  dispatch(updateSprite({field: 'width', value: props.width}))
                  dispatch(updateSprite({field: 'height', value: props.height}))
                  dispatch(updateSprite({field: 'rotation', value: props.rotation}))
                  dispatch(updateSprite({field: 'positionX', value: props.x}))
                  dispatch(updateSprite({field: 'positionY', value: props.y}))
                }}
                onSelect={(e: MouseEvent) => {
                  handleSelectSprite(e, s.id)
                  setSelectedSpriteId(s.id)
                }}
                isSelected={selectedSpriteId === s.id}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
