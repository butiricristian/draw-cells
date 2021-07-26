import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import './App.css';
import AnimationCanvas from './Canvas/AnimationCanvas';
import AnimationPreviewModal from './Frames/components/AnimationPreviewModal';
import { frames } from './Frames/reducers/frames';
import Header from './Header/Header';
import FramesSidebar from './Sidebars/components/FramesSidebar';
import PropertiesSidebar from './Sidebars/components/PropertiesSidebar';
import SpritesSidebar from './Sidebars/components/SpritesSidebar';
import { sidebars } from './Sidebars/reducers/sidebars';

function App() {
  const store = createStore(combineReducers({sidebars, frames}))
  const [isAnimationPreviewOpen, setIsAnimantionPreviewOpen] = useState(false)

  return (
    <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <Header setIsAnimantionPreviewOpen={setIsAnimantionPreviewOpen} />
      <div className="App" style={{display: 'flex', flexDirection: 'row', zIndex: 1}}>
        <AnimationCanvas />
        <SpritesSidebar />
        <FramesSidebar width={300} />
        <PropertiesSidebar width={300}/>
      </div>
      <AnimationPreviewModal open={isAnimationPreviewOpen} setOpen={setIsAnimantionPreviewOpen} />
    </DndProvider>
    </Provider>
  );
}

export default App;
