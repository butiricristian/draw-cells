import { IconButton, List, ListItem, makeStyles } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFrame } from '../../Frames/actions';
import Frame from '../../Frames/components/Frame';
import State from '../../stateInterface';
import { toggleFrames } from '../actions';
import SidebarInterface from '../interfaces/SidebarInterface';
import BaseSidebar from './BaseSidebar';

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: 'calc(100% - 25px)',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 25
  }
})

export default function FramesSidebar({width}: SidebarInterface) {
  const dispatch = useDispatch()
  const isFramesSidebarOpen = useSelector((state: State) => state.sidebars.isFramesOpen)
  const framesList = useSelector((state: State) => state.frames.frames)
  const classes = useStyles()

  const handleAddFrame = () => {
    const newFrame = {
      id: framesList.length + 1,
      title: `Frame ${framesList.length + 1}`,
      sprites: []
    }
    dispatch(addFrame(newFrame))
  }
  
  return (
    <BaseSidebar 
      isOpen={isFramesSidebarOpen} 
      toggleOpen={() => dispatch(toggleFrames())}
      iconRenderer={() => isFramesSidebarOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      anchor="bottom"
    >
      <div className={classes.container}>
        <List style={{height: 'calc(100% - 50px)', display: 'inline-flex', overflowX: 'auto'}}>
          {framesList.map(f => (
            <ListItem key={`frame-${f.id}`} style={{height: '100%'}}>
              <Frame id={f.id} title={f.title} />
            </ListItem>
          ))}
          <ListItem style={{height: '100%'}}>
            <IconButton color="primary" style={{display: 'flex', alignItems: 'center', fontSize: '4em'}} onClick={handleAddFrame}>
              <AddCircleOutlineIcon fontSize="inherit"/>
            </IconButton>
          </ListItem>
        </List>
      </div>
    </BaseSidebar>
  );
}