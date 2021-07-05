import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import AnimationCanvas from './Canvas/AnimationCanvas';
import PropertiesSidebar from './Sidebars/PropertiesSidebar';
import SpritesSidebar from './Sidebars/SpritesSidebar';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" style={{display: 'flex', flexDirection: 'row'}}>
        <SpritesSidebar width={300}/>
        <AnimationCanvas />
        <PropertiesSidebar width={300}/>
      </div>
    </DndProvider>
  );
}

export default App;
