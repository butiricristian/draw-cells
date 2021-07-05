import { List, ListItem, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Frame from '../../Canvas/Frame';
import State from '../../stateInterface';
import { toggleFrames } from '../actions';
import SidebarInterface from '../interfaces/SidebarInterface';
import BaseSidebar from './BaseSidebar';

export default function FramesSidebar({width}: SidebarInterface) {
  const [framesList, setFramesList] = useState(["Frame 1"])

  const dispatch = useDispatch()
  const isFramesSidebarOpen = useSelector((state: State) => state.sidebars.isFramesOpen)
  
  return (
    <BaseSidebar 
      isOpen={isFramesSidebarOpen} 
      toggleOpen={() => dispatch(toggleFrames())}
      iconRenderer={() => isFramesSidebarOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      anchor="bottom"
    >
      <div style={{width: '100%', height: '100%'}}>
        <Typography variant="subtitle1">Frames</Typography>
        <List style={{height: 'calc(100% - 50px)'}}>
          {framesList.map(f => (
            <ListItem style={{height: '100%'}}>
              <Frame title={f} />
            </ListItem>
          ))}
        </List>
      </div>
    </BaseSidebar>
  );
}