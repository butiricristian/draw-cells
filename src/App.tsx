import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import './App.css';
import AnimationCanvas from './Canvas/components/AnimationCanvas';
import { frames } from './Frames/reducers/frames';
import Header from './Header/Header';
import FramesSidebar from './Sidebars/components/FramesSidebar';
import PropertiesSidebar from './Sidebars/components/PropertiesSidebar';
import SpritesSidebar from './Sidebars/components/SpritesSidebar';
import { sidebars } from './Sidebars/reducers/sidebars';
import { presentations } from './Presentation/reducers/presentations';
import { canvas } from './Canvas/reducers/canvas';
import PresentationModal from './Presentation/components/PresentationModal';
import { CustomDragLayer } from './Canvas/components/CustomDragLayer';
import { ThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material';

const store = createStore(combineReducers({sidebars, frames, presentations, canvas}))

function App() {
  const theme = createTheme({})
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <Header />
          <div className="App">
            <CustomDragLayer/>
            <AnimationCanvas />
            <SpritesSidebar />
            <FramesSidebar />
            <PropertiesSidebar/>
          </div>
          <PresentationModal />
        </DndProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
