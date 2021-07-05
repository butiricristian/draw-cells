import React from 'react';
import { useDrag } from 'react-dnd';

interface SpritesSidebarProps{
  width: number,
}

export default function SpritesSidebar({width}: SpritesSidebarProps) {
  const [{isDragging: isSquareDragging}, squareDrag] = useDrag(() => ({
    type: 'SPRITE',
    item: { type: 'SQUARE' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  const [{isDragging: isCircleDragging}, circleDrag] = useDrag(() => ({
    type: 'SPRITE',
    item: { type: 'CIRCLE' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <>
      <div style={{borderRight: 'solid 1px #ddd', width: width, height: '100vh', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <div style={{paddingTop: 50, height: '100%'}}>
          <div ref={squareDrag} style={{width: 50, height: 50, backgroundColor: '#252525', opacity: isSquareDragging ? 0.5 : 1, cursor: 'pointer'}}></div>
          <div ref={circleDrag} style={{width: 50, height: 50, backgroundColor: '#252525', borderRadius: '50%', opacity: isCircleDragging ? 0.5 : 1, cursor: 'pointer'}}></div>
        </div>
      </div>
    </>
  );
}