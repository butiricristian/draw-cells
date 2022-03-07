import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { combineReducers, createStore } from 'redux';
import './App.css';
import AnimationCanvasContainer from './Canvas/components/AnimationCanvas';
import { canvas } from './Canvas/reducers/canvas';
import { auth } from './firebase-config';
import { frames } from './Frames/reducers/frames';
import Home from './Home/components/Home';
import homeReducer, { setUser } from './Home/reducers';
import PresentationPage from './Presentation/components/PresentationPage';
import { presentations } from './Presentation/reducers/presentations';
import { sidebars } from './Sidebars/reducers/sidebars';

const store = createStore(combineReducers({
  sidebars,
  frames,
  presentations,
  canvas,
  home: homeReducer
}))

function App() {
  const theme = createTheme({})

  onAuthStateChanged(auth, (user) => {
    store.dispatch(setUser(user))
  })

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Provider store={store}>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/canvas' element={<AnimationCanvasContainer />}/>
          <Route path='/present' element={<PresentationPage />}/>
        </Routes>
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
