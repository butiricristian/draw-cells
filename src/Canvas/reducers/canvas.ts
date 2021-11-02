import { Actions } from '../actions'

const initialState: CanvasState = {
  scale: 1
}

interface Action {
  type: string,
  payload: any,
}

export interface CanvasState {
  scale: number
}

export const canvas = (state: CanvasState = initialState, action: Action): CanvasState => {
  const {type, payload} = action
  switch(type){
    case Actions.SET_CANVAS_SCALE: {
      if (state.scale + payload.scaleIncrease < 0.5) return state
      if (state.scale + payload.scaleIncrease > 1) return state
      return {
        ...state,
        scale: state.scale + payload.scaleIncrease
      }
    }
    default:
      return state
  }
}
