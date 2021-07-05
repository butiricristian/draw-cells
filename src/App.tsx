import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import AnimationCanvas from './Canvas/AnimationCanvas';
import FramesSidebar from './Sidebars/components/FramesSidebar';
import PropertiesSidebar from './Sidebars/components/PropertiesSidebar';
import SpritesSidebar from './Sidebars/components/SpritesSidebar';
import {combineReducers, createStore} from 'redux';
import { sidebars } from './Sidebars/reducers/sidebars'

function App() {
  const store = createStore(combineReducers({sidebars}))

  return (
    <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{display: 'flex', flexDirection: 'row'}}>
        <AnimationCanvas />
        <SpritesSidebar width={300} />
        <FramesSidebar width={300} />
        <PropertiesSidebar width={300}/>
      </div>
    </DndProvider>
    </Provider>
  );
}

export default App;
