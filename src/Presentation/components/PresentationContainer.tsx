import { Button } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nextAnimationFrame, prevAnimationFrame } from '../../Frames/actions'
import { Sprite } from '../../Frames/reducers/frames'
import AnimationSprite from '../../Sprites/AnimationSprite'
import State from '../../stateInterface'

const PresentationContainer = () => {
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const prevFrame = useSelector((state: State) => state.frames.prevFrame)

  const currentFrameSpriteIds = currentFrame.sprites.map(s => s.id)
  const spritesToRemove = prevFrame?.sprites
    .filter(s => currentFrameSpriteIds.indexOf(s.id) < 0)
    .map(s => ({...s, opacity: 0})) || []

  const dispatch = useDispatch()
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{padding: '10px 50px 20px', borderTopRightRadius: 20, borderTopLeftRadius: 20, display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div ref={canvasRef} style={{flexGrow: 1, border: 'solid 1px #ddd', marginBottom: 20, overflow: 'hidden', position: 'relative'}}>
        {currentFrame.sprites.concat(...spritesToRemove).map((s: Sprite) => (
          <AnimationSprite
            backgroundUrl={s.backgroundUrl}
            id={s.id}
            position={s.position}
            key={`animation-${s.id}`}
            animationType={s.animationType}
            scale={s.scale}
            canvas={canvasRef.current}
            angle={s.angle}
            opacity={s.opacity}
            animationProps={s.animationProps}
            duration={s.duration}
            nrOfIterations={s.nrOfIterations}
            zIndex={s.zIndex}
          />
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <Button variant="outlined" color="primary" onClick={() => dispatch(prevAnimationFrame())}>PREV</Button>
        <Button variant="outlined" color="primary" onClick={() => dispatch(nextAnimationFrame())}>NEXT</Button>
      </div>
    </div>
  )
}

export default PresentationContainer