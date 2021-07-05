import { Actions } from '../actions'

const initialState: FramesState = {
  frames: [],
  currentFrame: {
    id: null,
    title: '',
    sprites: [],
  }
}

interface Action {
  type: string,
  payload: any,
}

export interface Sprite {
  id: number | string | null,
  position: {
    x: number,
    y: number,
  }
}

export interface Frame {
  id: number | string | null,
  title: string,
  sprites: Array<Sprite>
}

export interface FramesState {
  frames: Array<Frame>,
  currentFrame: Frame,
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
    default:
      return state
  }
}
