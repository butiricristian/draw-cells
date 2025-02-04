import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";

export interface HomeState {
  loginModalOpen: boolean,
  user: any
}

const initialState: HomeState = {
  loginModalOpen: false,
  user: {}
}

const toggleLoginModalOpenReducer = (state: HomeState, action: PayloadAction<boolean>) => {
  state.loginModalOpen = action.payload as unknown as boolean
}

const setUserReducer = (state: HomeState, action: PayloadAction<any>) => {
  state.user = action.payload
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    toggleLoginModalOpen: toggleLoginModalOpenReducer,
    setUser: setUserReducer
  }
})

export const { toggleLoginModalOpen, setUser } = homeSlice.actions
export default homeSlice.reducer
