import { PayloadAction } from '@reduxjs/toolkit'
import { Actions } from '../actions'

const initialState: SidebarsState = {
  isSpritesOpen: false,
  isFramesOpen: false,
  isPropertiesOpen: false,
}

export interface SidebarsState {
  isSpritesOpen: boolean,
  isFramesOpen: boolean,
  isPropertiesOpen: boolean,
  backgrounds?: Array<any>,
}

export const sidebars = (state: SidebarsState = initialState, action: PayloadAction<any>): SidebarsState => {
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
        backgrounds: [
          ...state.backgrounds || [],
          ...action.payload as Array<any>,
        ]
      }
    default:
      return state
  }
}
