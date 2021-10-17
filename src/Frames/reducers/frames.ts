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
  currentSprite: null,
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
  currentSprite: Sprite | null,
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
      if (!state.currentSprite) return {...state}

      let newCurrentSprite = state.currentSprite
      if (payload.field === 'positionX') {
        newCurrentSprite = {...newCurrentSprite, position: {x: payload.value, y: state.currentSprite?.position?.y || 0}}
      } else if (payload.field === 'positionY') {
        newCurrentSprite = {...newCurrentSprite, position: {x: state.currentSprite?.position?.x || 0, y: payload.value}}
      } else {
        newCurrentSprite = {...newCurrentSprite, [payload.field]: payload.value}
      }
      const crtFrame = {
        ...state.currentFrame,
        sprites: state.currentFrame.sprites.map(s => s.id === payload.id ? newCurrentSprite : s)
      }
      return {
        ...state,
        frames: state.frames.map(f => f.id === crtFrame.id ? crtFrame : f),
        currentFrame: crtFrame,
        currentSprite: newCurrentSprite
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
      const newCurrentSprite = crtFrame.sprites.find(s => s.id === state.currentSprite?.id) || null
      return {
        ...state,
        currentFrame: crtFrame,
        currentSprite: newCurrentSprite,
      }
    }
    case Actions.SET_CURRENT_SPRITE: {
      const crtSprite = state.currentFrame.sprites.find(s => s.id === payload)
      return {
        ...state,
        currentSprite: crtSprite || state.currentSprite
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
        currentSprite: newCurrentSprite
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
