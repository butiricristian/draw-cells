import { Actions } from '../actions'

const initialState: SidebarsState = {
  isSpritesOpen: false,
  isFramesOpen: false,
  isPropertiesOpen: false,
}

interface Action {
  type: string,
  payload: object,
}

export interface SidebarsState {
  isSpritesOpen: boolean,
  isFramesOpen: boolean,
  isPropertiesOpen: boolean,
  backgrounds?: Array<any>,
}

export const sidebars = (state: SidebarsState = initialState, action: Action): SidebarsState => {
  const {type} = action
  switch(type){
    case Actions.TOGGLE_SPRITES:
      return {
        ...state,
        isSpritesOpen: !state.isSpritesOpen,
      }
    case Actions.TOGGLE_PROPERTIES:
      return {
        ...state,
        isPropertiesOpen: !state.isPropertiesOpen,
      }
    case Actions.TOGGLE_FRAMES:
      return {
        ...state,
        isFramesOpen: !state.isFramesOpen,
      }
    case Actions.LOAD_BACKGROUNDS:
      return {
        ...state,
        backgrounds: action.payload as Array<any>,
      }
    default:
      return state
  }
}
