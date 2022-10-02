import { getRndInteger } from '../../helpers';
import { Actions } from '../actions';

const initialFrame = {
  id: 1,
  title: "Frame 1",
  sprites: []
}

const initialState: FramesState = {
  frames: [initialFrame],
  currentFrame: initialFrame,
  prevFrame: null,
  currentSprites: [],
  lastSpriteId: 1,
  title: '',
  isFramesSaving: false
}

interface Action {
  type: string,
  payload: any,
}

export interface Position {
  x: number,
  y: number,
}
export interface Sprite {
  id: number | string,
  position: Position,
  backgroundUrl?: string | undefined,
  animationType?: string | undefined,
  scale?: number | undefined,
  duration?: number | undefined,
  minTravelDistance?: number | undefined,
  rangeOfMovement?: number | undefined,
  nrOfIterations?: number | undefined,
  circleDirection?: number | undefined,
  angle?: number | undefined,
  opacity?: number,
  animationProps?: any,
  zIndex?: any,
  width: number,
  height: number,
  rotation: number,
}

export interface Frame {
  id: number | string | null,
  title: string,
  sprites: Array<Sprite>
  preview?: any,
}

export interface FramesState {
  frames: Array<Frame>,
  currentFrame: Frame,
  prevFrame: Frame | null,
  currentSprites: Array<Sprite>,
  lastSpriteId: number,
  title: string,
  isFramesSaving?: boolean
}

const computeSpritePosition = (sprite: Sprite, deltaX: number | undefined, deltaY: number | undefined): Sprite => {
  const newX = (sprite?.position.x || 0) + (deltaX || 0)
  const newY = (sprite?.position.y || 0) + (deltaY || 0)
  return {
    ...sprite,
    id: sprite.id,
    position: {
      ...sprite?.position,
      x: newX,
      y: newY,
    },
  }
}

const computeLinearAnimation = (currentSprite: Sprite, prevSprite: Sprite) => {
  return {x: currentSprite.position.x, y: currentSprite.position.y}
}

const computeChaoticAnimation = (currentSprite: Sprite, prevSprite: Sprite) => {
  if (!prevSprite) return {to: {x: currentSprite.position.x, y: currentSprite.position.y}}
  const chaoticArray = []
  let newLeft = prevSprite.position.x || 0
  const leftDistance = currentSprite.position?.x - newLeft
  let newTop = prevSprite.position.y || 0
  const topDistance = currentSprite.position?.y - newTop

  const finalMinTravelDistance = prevSprite.minTravelDistance || 15
  const rangeOfMotion = prevSprite.rangeOfMovement || 40
  const numberOfIterations = prevSprite.nrOfIterations || 10

  const leftStep = leftDistance / numberOfIterations
  const leftDirection = leftStep < 0 ? -1 : 1
  const topStep = topDistance / numberOfIterations
  const topDirection = topStep < 0 ? -1 : 1

  for(let i=0;i<numberOfIterations;i+=1){
    chaoticArray.push({x: newLeft, y: newTop})
    let newRandLeft
    const fromIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*i)
    const toIntermediaryLeftPoint = Math.round((prevSprite?.position.x || 0) + leftStep*(i+1))
    const fromLeft = fromIntermediaryLeftPoint - rangeOfMotion * leftDirection
    const toLeft = toIntermediaryLeftPoint + rangeOfMotion * leftDirection
    newRandLeft = getRndInteger(fromLeft, toLeft)
    if (Math.abs(newRandLeft - newLeft) < finalMinTravelDistance) {
      newRandLeft += finalMinTravelDistance * leftDirection
    }
    newLeft = newRandLeft

    let newRandTop
    const fromIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*i)
    const toIntermediaryTopPoint = Math.round((prevSprite?.position.y || 0) + topStep*(i+1))
    const fromTop = fromIntermediaryTopPoint - rangeOfMotion * topDirection
    const toTop = toIntermediaryTopPoint + rangeOfMotion * topDirection
    newRandTop = getRndInteger(fromTop, toTop)
    if (Math.abs(newRandTop - newTop) < finalMinTravelDistance) {
      newRandTop += finalMinTravelDistance * topDirection
    }
    newTop = newRandTop
  }
  chaoticArray.push({x: currentSprite.position.x, y: currentSprite.position.y})
  return chaoticArray
}

const computeCircularAnimation = (currentSprite: Sprite, prevSprite: Sprite) => {
  let currentCircleDirection: number = prevSprite?.circleDirection || 1
  const currentAngle: number = prevSprite?.angle || 90
  const [x1, y1, x2, y2] = [prevSprite?.position.x || 0, prevSprite?.position.y || 0, currentSprite.position.x, currentSprite.position.y]
  const pointsDistance = Math.round(Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))*100)/100
  const radius = Math.round((pointsDistance / 2) / (Math.sin((currentAngle/2) * (Math.PI/180)))*100)/100

  if (y1 <= y2) {
    currentCircleDirection *= -1
  }

  const m = Math.round((x1 - x2) / (y2 - y1) * 100)/100
  const x3 = (x1+x2)/2
  const y3 = (y1+y2)/2
  const a = Math.round((m*m + 1)*100)/100
  const b = Math.round((-2 * (x1 + y1*m - y3*m + m*m*x3)) * 100)/100
  const c = Math.round((x1*x1 + y1*y1 + 2*y1*(m*x3-y3) + m*m*x3*x3 + y3*y3 - 2*m*x3*y3 - radius*radius)*100)/100
  const delta = Math.round((b*b - 4*a*c)*100)/100
  const circleX = Math.round((-b + currentCircleDirection * Math.sqrt(delta)) / (2*a))
  const circleY = Math.round(m*circleX - m*x3 + y3)
  if (!circleX || !circleY) return {x: x2, y: y2}
  const distX = (circleX - x2)
  const distY = (circleY - y2)

  const angleDirection = (y1 > y2) ? -1 : 1
  const finalAngle = currentAngle * angleDirection * currentCircleDirection
  return { distX, distY, finalAngle, circleX, circleY }
}

const getAnimationProps = (currentSprite: Sprite, prevSprite: Sprite) => {
  if (!prevSprite) return computeLinearAnimation(currentSprite, prevSprite)
  switch(prevSprite.animationType) {
    case 'LINEAR': {
      return computeLinearAnimation(currentSprite, prevSprite)
    } case 'CHAOTIC': {
      return computeChaoticAnimation(currentSprite, prevSprite)
    } case 'CIRCULAR': {
      return computeCircularAnimation(currentSprite, prevSprite)
    }
  }

}

const computeNewFrames = (frames: Array<Frame>, crtFrame: Frame): Array<Frame> => {
  const crtFrameIndex = frames.map(f => f.id).indexOf(crtFrame.id)
  const crtFrameSprites = crtFrame.sprites.reduce((r: any, s) => {
    if (!s || !s.id) return r
    r[s.id] = s
    return r
  }, {})
  const prevFrameSprites = crtFrameIndex - 1 >= 0 && frames[crtFrameIndex - 1].sprites.reduce((r: any, s) => {
    if (!s || !s.id) return r
    r[s.id] = s
    return r
  }, {})
  const nextFrame = crtFrameIndex + 1 < frames.length && frames[crtFrameIndex + 1]

  for(let s of crtFrame.sprites) {
    s.animationProps = getAnimationProps(s, prevFrameSprites[s.id])
  }
  if (nextFrame) {
    for(let s of nextFrame.sprites) {
      s.animationProps = getAnimationProps(s, crtFrameSprites[s.id])
    }
  }

  const newFrames = frames.map(f => f.id === crtFrame.id ? crtFrame : f)
    .map(f => nextFrame && f.id === nextFrame.id ? nextFrame : f)

  return newFrames
}

// Possibly need in the future for Copy/Remove from all frames
// const computeAllNewFrames = (frames: Array<Frame>) => {
//   let newFrames = frames
//   for (let i = 0; i < frames.length; i++) {
//     newFrames = computeNewFrames(newFrames, newFrames[i])
//   }
//   return newFrames
// }

export const frames = (state: FramesState = initialState, action: Action): FramesState => {
  const {type, payload} = action
  switch(type){
    case Actions.SET_INITIAL_DATA: {
      if(!payload.frames || payload.frames.length <= 0) {
        return {
          ...initialState,
          title: payload.title,
        }
      }
      const lastSpriteId = Math.max(...payload.frames.map((f: Frame) => {
        if(!f.sprites) return 1
        return Math.max(...f.sprites.map( s => parseInt(s.id.toString()) ))
      }))
      return {
        ...initialState,
        title: payload.title,
        frames: payload.frames,
        lastSpriteId: lastSpriteId + 1,
        currentFrame: {
          ...payload.frames[0],
          sprites: payload.frames[0].sprites || []
        }
      }
    }
    case Actions.ADD_SPRITE: {
      const newSprite = {
        duration: 1,
        minTravelDistance: 15,
        rangeOfMovement: 40,
        nrOfIterations: 30,
        animationType: 'LINEAR',
        scale: {x: 1, y: 1},
        circleDirection: 1,
        angle: 90,
        opacity: 1,
        zIndex: 1,
        width: 50,
        height: 50,
        ...payload
      }
      const crtFrame = {
        ...state.currentFrame,
        sprites: [
          ...state.currentFrame.sprites,
          newSprite
        ]
      }
      const newFrames = computeNewFrames(state.frames, crtFrame)
      return {
        ...state,
        frames: newFrames,
        currentFrame: crtFrame,
        lastSpriteId: state.lastSpriteId + 1,
      }
    }
    case Actions.UPDATE_SPRITE: {
      if (!state.currentSprites || state.currentSprites.length <= 0) return {...state}

      const newCurrentSprites = []
      const newCurrentSpritesMap = new Map<string | number, Sprite>()
      for(let newCurrentSprite of state.currentSprites){
        if (payload.field === 'positionX') {
          newCurrentSprite = {...newCurrentSprite, position: {x: parseInt(payload.value), y: newCurrentSprite?.position?.y || 0}}
        } else if (payload.field === 'positionY') {
          newCurrentSprite = {...newCurrentSprite, position: {x: newCurrentSprite?.position?.x || 0, y: parseInt(payload.value)}}
        } else {
          newCurrentSprite = {...newCurrentSprite, [payload.field]: payload.value}
        }
        newCurrentSprites.push(newCurrentSprite)
        newCurrentSprite.id && newCurrentSpritesMap.set(newCurrentSprite.id, newCurrentSprite)
      }
      const crtFrame = {
        ...state.currentFrame,
        sprites: state.currentFrame.sprites
          .map(s => {
            let newS = null
            if (s.id && newCurrentSpritesMap.get(s.id)) newS = newCurrentSpritesMap.get(s.id)
            if (newS) return newS
            return s
          })
      }
      const newFrames = computeNewFrames(state.frames, crtFrame)
      return {
        ...state,
        frames: newFrames,
        currentFrame: crtFrame,
        currentSprites: newCurrentSprites
      }
    }
    case Actions.REMOVE_SPRITE: {
      const crtFrame = {
        ...state.currentFrame,
        sprites: state.currentFrame.sprites.filter(s => s.id !== payload.id)
      }
      const newFrames = computeNewFrames(state.frames, crtFrame)
      return {
        ...state,
        frames: newFrames,
        currentFrame: crtFrame,
      }
    }
    case Actions.REMOVE_SPRITE_FROM_ALL_FRAMES: {
      const crtFrame = {
        ...state.currentFrame,
        sprites: state.currentFrame.sprites.filter(s => s.id !== payload.id)
      }
      const newFrames = state.frames.map(f => ({
        ...f,
        sprites: f.sprites.filter(s => s.id !== payload.id)
      }))
      return {
        ...state,
        frames: newFrames,
        currentFrame: crtFrame,
      }
    }
    case Actions.REMOVE_CURRENT_SPRITES: {
      const currentSpritesIds = state.currentSprites.map(x => x.id)
      const crtFrame = {
        ...state.currentFrame,
        sprites: state.currentFrame.sprites.filter(s => currentSpritesIds.indexOf(s.id) < 0)
      }
      const newFrames = computeNewFrames(state.frames, crtFrame)
      return {
        ...state,
        frames: newFrames,
        currentFrame: crtFrame,
      }
    }
    case Actions.REMOVE_CURRENT_SPRITES_FROM_ALL_FRAMES: {
      const currentSpritesIds = state.currentSprites.map(x => x.id)
      const crtFrame = {
        ...state.currentFrame,
        sprites: state.currentFrame.sprites.filter(s => currentSpritesIds.indexOf(s.id) < 0)
      }
      const newFrames = state.frames.map(f => ({
        ...f,
        sprites: f.sprites.filter(s => currentSpritesIds.indexOf(s.id) < 0)
      }))
      return {
        ...state,
        frames: newFrames,
        currentFrame: crtFrame,
      }
    }
    case Actions.COPY_SPRITE_INTO_FRAME: {
      const spriteToCopy = state.currentFrame.sprites.find(s => s.id === payload.spriteId)
      if (spriteToCopy) {
        const newFrames = state.frames.map(f => f.id === payload.frameId ? {...f, sprites: [...f.sprites, spriteToCopy]} : f)
        return {
          ...state,
          frames: newFrames,
        }
      }
      return {...state}
    }
    case Actions.COPY_SELECTED_SPRITES_INTO_FRAME: {
      const currentSpritesIds = state.currentSprites.map(x => x.id)
      const spritesToCopy = state.currentFrame.sprites.filter(s => currentSpritesIds.indexOf(s.id) > -1)
      if (spritesToCopy) {
        const newFrames = state.frames.map(f => f.id === payload.frameId ? {...f, sprites: [...f.sprites, ...spritesToCopy]} : f)
        return {
          ...state,
          frames: newFrames,
        }
      }
      return {...state}
    }
    case Actions.ADD_FRAME: {
      const newFrames = computeNewFrames([...state.frames, payload], payload)
      return {
        ...state,
        currentFrame: payload,
        frames: newFrames
      }
    }
    case Actions.REMOVE_FRAME:
      return {
        ...state,
        frames: state.frames.filter(f => f.id !== payload.id),
        currentFrame: payload.id === state.currentFrame.id ? state.frames[0] : state.currentFrame
      }
    case Actions.SET_CURRENT_FRAME: {
      const crtFrame = state.frames.find(f => f.id === payload) || initialState.frames[0]
      const newCurrentSprites = crtFrame.sprites.filter(s => state.currentSprites.find(crtSprite => crtSprite.id === s.id)) || []
      return {
        ...state,
        currentFrame: crtFrame,
        currentSprites: newCurrentSprites,
      }
    }
    case Actions.SET_CURRENT_SPRITE: {
      const crtSprite = state.currentFrame.sprites.find(s => s.id === payload)
      const shouldRemove = !!state.currentSprites.find(s => s.id === payload)
      return {
        ...state,
        currentSprites: crtSprite && !shouldRemove ? [crtSprite] : []
      }
    }
    case Actions.ADD_CURRENT_SPRITE: {
      const crtSprite = state.currentFrame.sprites.find(s => s.id === payload)
      const shouldRemove = !!state.currentSprites.find(s => s.id === payload)
      return {
        ...state,
        currentSprites: crtSprite ? (shouldRemove ? state.currentSprites.filter(s => s.id !== payload) : [...state.currentSprites, crtSprite]) : state.currentSprites
      }
    }
    case Actions.UPDATE_CURRENT_SPRITE_POSITION: {
      const {id, deltaX, deltaY} = payload
      const currentSpritesIds = state.currentSprites.map(x => x.id)
      if (state.currentSprites.length > 0 && currentSpritesIds.indexOf(id) > -1) {
        const newCurrentSpritesById = new Map<string | number, Sprite>()
        for(let crtSprite of state.currentSprites) {
          if (!crtSprite.id) continue
          const newCurrentSprite: Sprite = computeSpritePosition(crtSprite, deltaX, deltaY)
          newCurrentSpritesById.set(crtSprite.id, newCurrentSprite)
        }
        const newCurrentFrame = {
          ...state.currentFrame,
          sprites: state.currentFrame.sprites.map(s => {
            let newS = null
            if (s.id && newCurrentSpritesById.get(s.id)) newS = newCurrentSpritesById.get(s.id)
            if (newS) return newS
            return s
          })
        }
        const newFrames = computeNewFrames(state.frames, newCurrentFrame)
        return {
          ...state,
          frames: newFrames,
          currentFrame: newCurrentFrame,
          currentSprites: state.currentSprites.map(s => {
            let newS = null
            if (s.id && newCurrentSpritesById.get(s.id)) newS = newCurrentSpritesById.get(s.id)
            if (newS) return newS
            return s
          })
        }
      } else {
        const crtSprite = state.currentFrame.sprites.find(s => s.id === id)
        if (!crtSprite) return {...state}

        const newCurrentSprite = computeSpritePosition(crtSprite, deltaX, deltaY)
        const newCurrentFrame = {
          ...state.currentFrame,
          sprites: state.currentFrame.sprites.map(s => s.id === id ? newCurrentSprite : s)
        }
        const newFrames = computeNewFrames(state.frames, newCurrentFrame)
        return {
          ...state,
          frames: newFrames,
          currentFrame: newCurrentFrame,
          currentSprites: state.currentSprites.map(s => s.id === id ? newCurrentSprite : s)
        }
      }
    }
    case Actions.NEXT_FRAME: {
      let newCrtFrame = state.currentFrame
      const crtFrameIndex = state.frames.findIndex(f => f.id === state.currentFrame.id)
      if(crtFrameIndex < state.frames.length - 1) newCrtFrame=state.frames[crtFrameIndex + 1]
      const newCurrentSprites = newCrtFrame.sprites.filter(s => state.currentSprites.find(crtSprite => crtSprite.id === s.id)) || []
      return {
        ...state,
        currentFrame: newCrtFrame,
        prevFrame: state.currentFrame,
        currentSprites: newCurrentSprites,
      }
    }
    case Actions.PREV_FRAME: {
      let newCrtFrame = state.currentFrame
      const crtFrameIndex = state.frames.findIndex(f => f.id === state.currentFrame.id)
      if(crtFrameIndex > 0) newCrtFrame=state.frames[crtFrameIndex - 1]
      const newCurrentSprites = newCrtFrame.sprites.filter(s => state.currentSprites.find(crtSprite => crtSprite.id === s.id)) || []
      return {
        ...state,
        currentFrame: newCrtFrame,
        prevFrame: state.currentFrame,
        currentSprites: newCurrentSprites,
      }
    }
    case 'TOGGLE_MODAL': {
      return {
        ...state,
        prevFrame: null,
      }
    }
    case Actions.UPDATE_PRESENTATION_TITLE: {
      return {
        ...state,
        title: payload
      }
    }
    case Actions.SET_IS_FRAMES_SAVING: {
      return {
        ...state,
        isFramesSaving: payload
      }
    }
    case Actions.SET_FRAME_PREVIEW: {
      const newFrames = state.frames.map(x => x.id === payload.frameId ? {...x, preview: payload.preview} : x)
      return {
        ...state,
        frames: newFrames
      }
    }
    default:
      return state
  }
}
