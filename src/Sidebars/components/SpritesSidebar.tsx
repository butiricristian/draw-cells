import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../stateInterface';
import { toggleSprites } from '../actions';
import SidebarInterface from '../interfaces/SidebarInterface';
import BaseSidebar from './BaseSidebar';

export default function SpritesSidebar({width}: SidebarInterface) {
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

  const dispatch = useDispatch()
  const isSpritesSidebarOpen = useSelector((state: State) => state.sidebars.isSpritesOpen)

  return (
    <>
      <BaseSidebar 
        isOpen={isSpritesSidebarOpen} 
        toggleOpen={() => dispatch(toggleSprites())}
        iconRenderer={() => isSpritesSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        anchor="left"
      >
        <div style={{paddingTop: 50, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div ref={squareDrag} style={{width: 50, height: 50, backgroundColor: '#252525', opacity: isSquareDragging ? 0.5 : 1, cursor: 'pointer'}}></div>
          <div ref={circleDrag} style={{width: 50, height: 50, backgroundColor: '#252525', borderRadius: '50%', opacity: isCircleDragging ? 0.5 : 1, cursor: 'pointer'}}></div>
        </div>
      </BaseSidebar>
    </>
  );
}