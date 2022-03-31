import { Input, InputAdornment, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSprite } from '../../Frames/actions';
import State from '../../stateInterface';
import { toggleProperties } from '../actions';
import BaseSidebar from './BaseSidebar';
import { Info } from '@mui/icons-material';

const ROM_AND_MTD_ERRORS = {
  minTravelDistance: 'Min travel distance must be lower than Range of movement',
  rangeOfMovement: 'Range of movement must be greater than Min travel distance'
}

export default function PropertiesSidebar() {
  const dispatch = useDispatch()
  const isPropertiesSidebarOpen = useSelector((state: State) => state.sidebars.isPropertiesOpen)
  const currentSprites = useSelector((state: State) => state.frames.currentSprites)
  const currentSprite = currentSprites.length <= 0 ? null : currentSprites[0]
  const [validationErrors, setValidationErrors]: any = useState({})

  const updateSpriteProperty = ({field, value}: any) => {
    dispatch(updateSprite({field, value}))
  }

  return (
    <BaseSidebar
      isOpen={isPropertiesSidebarOpen}
      toggleOpen={() => dispatch(toggleProperties())}
      iconRenderer={() => isPropertiesSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      anchor="right"
    >
      <div style={{height: '100vh'}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Propety</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography align="center" variant="body2" style={{fontWeight: 'bold'}}>Display</Typography>
              </TableCell>
            </TableRow>
            <TableRow key="id">
              <TableCell>id</TableCell>
              <TableCell>
                <Input
                  value={currentSprite?.id || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'id', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="positionX">
              <TableCell>Position X</TableCell>
              <TableCell>
                <Input
                  value={currentSprite?.position.x || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'positionX', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="positionY">
              <TableCell>Position Y</TableCell>
              <TableCell>
                <Input
                  value={currentSprite?.position.y || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'positionY', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="scale">
              <TableCell>Scale</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={currentSprite?.scale || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'scale', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <Typography align="center" variant="body2" style={{fontWeight: 'bold'}}>Animation</Typography>
              </TableCell>
            </TableRow>
            <TableRow key="duration">
              <TableCell>Duration</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={currentSprite?.duration || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'duration', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="animationType">
              <TableCell>Animation Type</TableCell>
              <TableCell>
                <Select
                  value={currentSprite?.animationType || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'animationType', value: e.target.value}))}
                >
                  <MenuItem value="LINEAR">Linear</MenuItem>
                  <MenuItem value="CHAOTIC">Chaotic</MenuItem>
                  <MenuItem value="CIRCULAR">Circular</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
            {currentSprite?.animationType === 'CHAOTIC' && (<TableRow key="minTravelDistance">
              <TableCell>Min. Travel Distance</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={currentSprite?.minTravelDistance || ''}
                  onChange={(e) => updateSpriteProperty({field: 'minTravelDistance', value: parseInt(e.target.value)})}
                  endAdornment={validationErrors.minTravelDistance ? (<InputAdornment position="end"><Tooltip title={validationErrors.minTravelDistance}><Info color="error"/></Tooltip></InputAdornment>) : (<></>)}
                  error={validationErrors.minTravelDistance}
                />
              </TableCell>
            </TableRow>)}
            {currentSprite?.animationType === 'CHAOTIC' && (<TableRow key="rangeOfMovement">
              <TableCell>Range of Movement</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={currentSprite?.rangeOfMovement || ''}
                  onChange={(e) => updateSpriteProperty({field: 'rangeOfMovement', value: parseInt(e.target.value)})}
                  endAdornment={validationErrors.rangeOfMovement ? (<InputAdornment position="end"><Tooltip title={validationErrors.rangeOfMovement}><Info color="error"/></Tooltip></InputAdornment>) : (<></>)}
                  error={validationErrors.rangeOfMovement}
                />
              </TableCell>
            </TableRow>)}
            {currentSprite?.animationType === 'CHAOTIC' && (<TableRow key="nrOfIterations">
              <TableCell>Number of iterations</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={currentSprite?.nrOfIterations || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'nrOfIterations', value: parseInt(e.target.value || '0')}))}
                />
              </TableCell>
            </TableRow>)}
            {currentSprite?.animationType === 'CIRCULAR' && (<TableRow key="circleDirection">
              <TableCell>Circle Direction</TableCell>
              <TableCell>
                <Select
                  value={currentSprite?.circleDirection || 1}
                  onChange={(e) => dispatch(updateSprite({field: 'circleDirection', value: e.target.value}))}
                >
                  <MenuItem value={1}>Upwards</MenuItem>
                  <MenuItem value={-1}>Downwards</MenuItem>
                </Select>
              </TableCell>
            </TableRow>)}
            {currentSprite?.animationType === 'CIRCULAR' && (<TableRow key="angle">
              <TableCell>Angle</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={currentSprite?.angle || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'angle', value: e.target.value}))}
                />
              </TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </BaseSidebar>
  );
}