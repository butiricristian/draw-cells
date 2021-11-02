import { Actions } from '../actions'

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
            animationType: 'CHAOTIC',
            scale: 1,
            ...payload
          }
        ]
      }
      return {
        ...state,
        frames: state.frames.map(f => f.id === crtFrame.id ? crtFrame : f),
        currentFrame: crtFrame,
      }
    }
    case Actions.UPDATE_SPRITE: {
      if (!state.currentSprites) return {...state}

      const newCurrentSprites = []
      const newCurrentSpritesMap = new Map<string | number, Sprite>()
      for(let newCurrentSprite of state.currentSprites){
        if (payload.field === 'positionX') {
          newCurrentSprite = {...newCurrentSprite, position: {x: payload.value, y: newCurrentSprite?.position?.y || 0}}
        } else if (payload.field === 'positionY') {
          newCurrentSprite = {...newCurrentSprite, position: {x: newCurrentSprite?.position?.x || 0, y: payload.value}}
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
            if (s.id && s.id === payload.id) newS = newCurrentSpritesMap.get(s.id)
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
    case Actions.ADD_FRAME:
      return {
        ...state,
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
      const {id, position} = payload
      const crtSprite = state.currentFrame.sprites.find(s => s.id === id) || null
      const newCurrentSprite: Sprite = {
        ...crtSprite,
        id: id,
        position: position,
      }
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
    case Actions.NEXT_FRAME: {
      let newCrtFrame = state.currentFrame
      const crtFrameIndex = state.frames.findIndex(f => f.id === state.currentFrame.id)
      if(crtFrameIndex < state.frames.length - 1) newCrtFrame=state.frames[crtFrameIndex + 1]
      return {
        ...state,
        currentFrame: newCrtFrame,
        prevFrame: state.currentFrame
      }
    }
    case Actions.PREV_FRAME: {
      let newCrtFrame = state.currentFrame
      const crtFrameIndex = state.frames.findIndex(f => f.id === state.currentFrame.id)
      if(crtFrameIndex > 0) newCrtFrame=state.frames[crtFrameIndex - 1]
      return {
        ...state,
        currentFrame: newCrtFrame,
        prevFrame: state.currentFrame
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
