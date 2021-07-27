import { makeStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SidebarSprite from '../../Sprites/SidebarSprite';
import State from '../../stateInterface';
import { toggleSprites } from '../actions';
import BaseSidebar from './BaseSidebar';

const useStyles = makeStyles({
  container: {paddingTop: 50, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'},
  sprite: {width: 50, height: 50, cursor: 'pointer'}
})

const SPRITES_LIST = ["b_cell_1", "dendritic_cell_1", "dendritic_cell_2", "t_cell_1", "t_cell_2"]

export default function SpritesSidebar() {
  const dispatch = useDispatch()
  const isSpritesSidebarOpen = useSelector((state: State) => state.sidebars.isSpritesOpen)
  const classes = useStyles()

  return (
    <>
      <BaseSidebar 
        isOpen={isSpritesSidebarOpen} 
        toggleOpen={() => dispatch(toggleSprites())}
        iconRenderer={() => isSpritesSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        anchor="left"
      >
        <div className={classes.container}>
          {SPRITES_LIST.map((s, i) => (
            <SidebarSprite key={`sprite-${i}`} backgroundUrl={s}/>
          ))}
        </div>
      </BaseSidebar>
    </>
  );
}