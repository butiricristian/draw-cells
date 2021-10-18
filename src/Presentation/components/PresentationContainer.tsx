import { Button } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nextAnimationFrame, prevAnimationFrame } from '../../Frames/actions'
import { Sprite } from '../../Frames/reducers/frames'
import AnimationSprite from '../../Sprites/AnimationSprite'
import State from '../../stateInterface'

const PresentationContainer = () => {
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const dispatch = useDispatch()

  return (
    <div style={{padding: '10px 50px 20px', borderTopRightRadius: 20, borderTopLeftRadius: 20, display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{flexGrow: 1, border: 'solid 1px #ddd', marginBottom: 20, overflow: 'hidden', position: 'relative'}}>
        {currentFrame.sprites.map((s: Sprite) => (
          <AnimationSprite
            backgroundUrl={s.backgroundUrl}
            id={s.id}
            position={s.position}
            key={`animation-${s.id}`}
            animationType={s.animationType}
            scale={s.scale}
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