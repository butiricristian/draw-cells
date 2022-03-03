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
  lastSpriteId: 0
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
  id: number | string | null,
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
  opacity?: number
}

export interface Frame {
  id: number | string | null,
  title: string,
  sprites: Array<Sprite>
}

export interface FramesState {
  frames: Array<Frame>,
  currentFrame: Frame,
  prevFrame: Frame | null,
  currentSprites: Array<Sprite>,
  lastSpriteId: number
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

export const frames = (state: FramesState = initialState, action: Action): FramesState => {
  const {type, payload} = action
  switch(type){
    case Actions.ADD_SPRITE: {
      const crtFrame = {
        ...state.currentFrame,
        sprites: [
          ...state.currentFrame.sprites,
          {
            duration: 1,
            minTravelDistance: 15,
            rangeOfMovement: 40,
            nrOfIterations: 30,
            animationType: 'LINEAR',
            scale: 1,
            circleDirection: 1,
            angle: 90,
            opacity: 1,
            ...payload
          }
        ]
      }
      return {
        ...state,
        frames: state.frames.map(f => f.id === crtFrame.id ? crtFrame : f),
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
      return {
        ...state,
        frames: state.frames.map(f => f.id === crtFrame.id ? crtFrame : f),
        currentFrame: crtFrame,
        currentSprites: newCurrentSprites
      }
    }
    case Actions.REMOVE_SPRITE: {
      const crtFrame = {
        ...state.currentFrame,
        sprites: state.currentFrame.sprites.filter(s => s.id !== payload.id)
      }
      return {
        ...state,
        frames: state.frames.map(f => f.id === crtFrame.id ? crtFrame : f),
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
      return {
        ...state,
        frames: state.frames.map(f => f.id === crtFrame.id ? crtFrame : f),
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
      console.log(spritesToCopy)
      if (spritesToCopy) {
        const newFrames = state.frames.map(f => f.id === payload.frameId ? {...f, sprites: [...f.sprites, ...spritesToCopy]} : f)
        return {
          ...state,
          frames: newFrames,
        }
      }
      return {...state}
    }
    case Actions.ADD_FRAME:
      return {
        ...state,
        currentFrame: payload,
        frames: [...state.frames, payload]
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
        return {
          ...state,
          frames: state.frames.map(f => f.id === state.currentFrame.id ? newCurrentFrame : f),
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
        return {
          ...state,
          frames: state.frames.map(f => f.id === state.currentFrame.id ? newCurrentFrame : f),
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
    default:
      return state
  }
}
