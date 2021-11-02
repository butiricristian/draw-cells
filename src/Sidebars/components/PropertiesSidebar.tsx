import { Input, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSprite } from '../../Frames/actions';
import State from '../../stateInterface';
import { toggleProperties } from '../actions';
import SidebarInterface from '../interfaces/SidebarInterface';
import BaseSidebar from './BaseSidebar';

export default function PropertiesSidebar({width}: SidebarInterface) {
  const dispatch = useDispatch()
  const isPropertiesSidebarOpen = useSelector((state: State) => state.sidebars.isPropertiesOpen)
  const currentSprites = useSelector((state: State) => state.frames.currentSprites)
  const currentSprite = currentSprites.length === 1 ? null : currentSprites[0]
  
  return (
    <BaseSidebar 
      isOpen={isPropertiesSidebarOpen} 
      toggleOpen={() => dispatch(toggleProperties())}
      iconRenderer={() => isPropertiesSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      anchor="right"
    >
      <div style={{height: '100vh'}}>
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
              <TableCell>
                <Input 
                  value={currentSprite?.id || ''} 
                  onChange={(e) => dispatch(updateSprite({id: currentSprite?.id, field: 'id', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="positionX">
              <TableCell>Position X</TableCell>
              <TableCell>
                <Input 
                  value={currentSprite?.position.x || ''}
                  onChange={(e) => dispatch(updateSprite({id: currentSprite?.id, field: 'positionX', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="positionY">
              <TableCell>Position Y</TableCell>
              <TableCell>
                <Input 
                  value={currentSprite?.position.y || ''}
                  onChange={(e) => dispatch(updateSprite({id: currentSprite?.id, field: 'positionY', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="animationType">
              <TableCell>Animation Type</TableCell>
              <TableCell>
                <Select 
                  value={currentSprite?.animationType || ''}
                  onChange={(e) => dispatch(updateSprite({id: currentSprite?.id, field: 'animationType', value: e.target.value}))}
                >
                  <MenuItem value="LINEAR">Linear</MenuItem>
                  <MenuItem value="CHAOTIC">Chaotic</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
            <TableRow key="scale">
              <TableCell>Scale</TableCell>
              <TableCell>
                <Input 
                  type="number"
                  value={currentSprite?.scale || ''}
                  onChange={(e) => dispatch(updateSprite({id: currentSprite?.id, field: 'scale', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </BaseSidebar>
  );
}