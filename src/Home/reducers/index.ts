import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HomeState {
  loginModalOpen: boolean,
  user: any
}

const initialState: HomeState = {
  loginModalOpen: false,
  user: {}
}

const toggleLoginModalOpenReducer = (state: HomeState, action: PayloadAction<any>) => {
  state.loginModalOpen = action.payload
}

const setUserReducer = (state: HomeState, action: PayloadAction<any>) => {
  state.user = action.payload
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    toggleLoginModalOpen: toggleLoginModalOpenReducer,
    setUser: setUserReducer,
  }
})

export const { toggleLoginModalOpen, setUser } = homeSlice.actions
export default homeSlice.reducer