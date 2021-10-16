import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import './App.css';
import AnimationCanvas from './Canvas/AnimationCanvas';
import { frames } from './Frames/reducers/frames';
import Header from './Header/Header';
import FramesSidebar from './Sidebars/components/FramesSidebar';
import PropertiesSidebar from './Sidebars/components/PropertiesSidebar';
import SpritesSidebar from './Sidebars/components/SpritesSidebar';
import { sidebars } from './Sidebars/reducers/sidebars';

const store = createStore(combineReducers({sidebars, frames}))

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Header />
        <div className="App">
          <AnimationCanvas />
          <SpritesSidebar />
          <FramesSidebar width={300} />
          <PropertiesSidebar width={300}/>
        </div>
      </DndProvider>
    </Provider>
  );
}

export default App;
