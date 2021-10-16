import { Actions } from '../actions'

const initialFrame = {
  id: 1,
  title: "Frame 1",
  sprites: []
}

const initialState: FramesState = {
  frames: [initialFrame],
  currentFrame: initialFrame,
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
}

export interface Frame {
  id: number | string | null,
  title: string,
  sprites: Array<Sprite>
}

export interface FramesState {
  frames: Array<Frame>,
  currentFrame: Frame,
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
          payload
        ]
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
    case Actions.SET_CURRENT_FRAME: {
      const crtFrame = state.frames.find(f => f.id === payload) || initialState.frames[0]
      return {
        ...state,
        currentFrame: crtFrame
      }
    }
    case Actions.SET_CURRENT_SPRITE: {
      const crtSprite = state.currentFrame.sprites.find(s => s.id === payload) || null
      return {
        ...state,
        currentSprite: crtSprite
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
    default:
      return state
  }
}
