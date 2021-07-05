import React from 'react';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import BaseSprite from '../Sprites/BaseSprite';

function AnimationCanvas() {
  const [sprites, setSprites] = useState([])
  console.log(sprites)

  function createSprite({x, y}){
    const newSprite = {
      position: {x, y}
    }
    setSprites([...sprites, newSprite])
  }

  const [{isOver}, drop] = useDrop(({
    accept: 'SPRITE',
    drop: (_, monitor) => createSprite(monitor.getSourceClientOffset()),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }))

  return (
    <div style={{flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <div ref={drop} style={{flexGrow: 1, backgroundColor: (isOver ? '#d7d7d7' : '#fff')}}>
        {sprites.map(s => (
          <BaseSprite position={s.position} />
        ))}
      </div>
      <div style={{width: '100%', height: 200, borderTop: 'solid 1px #d7d7d7'}}>
          
      </div>
    </div>
  );
}

export default AnimationCanvas;
