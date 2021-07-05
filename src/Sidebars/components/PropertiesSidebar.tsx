import { List, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../stateInterface';
import { toggleProperties } from '../actions';
import SidebarInterface from '../interfaces/SidebarInterface';
import BaseSidebar from './BaseSidebar';

export default function PropertiesSidebar({width}: SidebarInterface) {
  const dispatch = useDispatch()
  const isPropertiesSidebarOpen = useSelector((state: State) => state.sidebars.isPropertiesOpen)
  
  return (
    <BaseSidebar 
      isOpen={isPropertiesSidebarOpen} 
      toggleOpen={() => dispatch(toggleProperties())}
      iconRenderer={() => isPropertiesSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      anchor="right"
    >
      <div style={{width: width, height: '100vh'}}>
        <Typography variant="subtitle1">Properties</Typography>
        <List>

        </List>
      </div>
    </BaseSidebar>
  );
}