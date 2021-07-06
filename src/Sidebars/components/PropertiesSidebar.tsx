import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
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
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const currentSprite = useSelector((state: State) => state.frames.currentSprite)
  
  return (
    <BaseSidebar 
      isOpen={isPropertiesSidebarOpen} 
      toggleOpen={() => dispatch(toggleProperties())}
      iconRenderer={() => isPropertiesSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      anchor="right"
    >
      <div style={{width: width, height: '100vh'}}>
        <Typography variant="subtitle1">Properties</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Propety</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key="id">
              <TableCell>id</TableCell>
              <TableCell>{currentSprite?.id}</TableCell>
            </TableRow>
            <TableRow key="positionX">
              <TableCell>Position X</TableCell>
              <TableCell>{currentSprite?.position.x}</TableCell>
            </TableRow>
            <TableRow key="positionY">
              <TableCell>Position Y</TableCell>
              <TableCell>{currentSprite?.position.y}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </BaseSidebar>
  );
}