import { Actions } from '../actions'

const initialState: PresentationState = {
  isModalOpen: false,
}

interface Action {
  type: string,
  payload: any,
}

export interface PresentationState {
  isModalOpen: boolean
}

export const presentations = (state: PresentationState = initialState, action: Action): PresentationState => {
  const {type, payload} = action
  switch(type){
    case Actions.TOGGLE_MODAL: {
      return {
        ...state,
        isModalOpen: payload
      }
    }
    default:
      return state
  }
}
