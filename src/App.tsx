"use client"

import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { Provider } from 'react-redux';
import { canvas } from './Canvas/reducers/canvas';
import { auth } from './firebase-config';
import { frames } from './Frames/reducers/frames';
import homeReducer, { setUser } from './Home/reducers';
import { presentations } from './Presentation/reducers/presentations';
import { sidebars } from './Sidebars/reducers/sidebars';
import { configureStore, PayloadAction } from '@reduxjs/toolkit';

const store = configureStore<any, PayloadAction<any>, any>({
  reducer: {
    sidebars,
    frames,
    presentations,
    canvas,
    home: homeReducer
  }
})

function App({children}: {children?: React.ReactNode}) {
  const theme = createTheme({})

  onAuthStateChanged(auth, (user) => {
    store.dispatch(setUser(user))
  })

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        {children}
      </Provider>
    </ThemeProvider>
  );
}

export default App;
