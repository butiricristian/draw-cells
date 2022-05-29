import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Input, MenuItem, Select, Slider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSprite } from '../../Frames/actions';
import State from '../../stateInterface';
import { toggleProperties } from '../actions';
import BaseSidebar from './BaseSidebar';

function ChaoticAnimationProperties({currentSprite}: any) {
  const dispatch = useDispatch()
  const [rangeOfMovementSlider, setRangeOfMovementSlider] = useState(currentSprite.rangeOfMovement)
  const [nrOfIterationsSlider, setNrOfIterationsSlider] = useState(currentSprite.nrOfIterations)

  return (
    <>
      {/* <TableRow key="minTravelDistance">
        <TableCell>Min. Travel Distance</TableCell>
        <TableCell>
          <Input
            type="number"
            value={currentSprite?.minTravelDistance || ''}
            onChange={(e) => dispatch(updateSprite({field: 'minTravelDistance', value: parseInt(e.target.value)}))}
          />
        </TableCell>
      </TableRow> */}
      <TableRow key="rangeOfMovement">
        <TableCell>Narrow/Wide</TableCell>
        <TableCell>
          {/* <Input
            type="number"
            value={currentSprite?.rangeOfMovement || ''}
            onChange={(e) => dispatch(updateSprite({field: 'rangeOfMovement', value: parseInt(e.target.value)}))}
          /> */}
          <Slider
            step={10}
            min={10}
            max={500}
            valueLabelDisplay="auto"
            onChange={(e, newValue) => setRangeOfMovementSlider(newValue)}
            onChangeCommitted={(e, newValue) => dispatch(updateSprite({field: 'rangeOfMovement', value: newValue}))}
            value={rangeOfMovementSlider}
          />
        </TableCell>
      </TableRow>
      <TableRow key="nrOfIterations">
        <TableCell>Slow/Fast</TableCell>
        <TableCell>
          {/* <Input
            type="number"
            value={currentSprite?.nrOfIterations || ''}
            onChange={(e) => dispatch(updateSprite({field: 'nrOfIterations', value: parseInt(e.target.value || '0')}))}
          /> */}
          <Slider
            step={1}
            min={1}
            max={30}
            valueLabelDisplay="auto"
            onChange={(e, newValue) => setNrOfIterationsSlider(newValue)}
            onChangeCommitted={(e, newValue) => dispatch(updateSprite({field: 'nrOfIterations', value: newValue}))}
            value={nrOfIterationsSlider}
          />
        </TableCell>
      </TableRow>
    </>
  )
}

export default function PropertiesSidebar() {
  const dispatch = useDispatch()
  const isPropertiesSidebarOpen = useSelector((state: State) => state.sidebars.isPropertiesOpen)
  const currentSprites = useSelector((state: State) => state.frames.currentSprites)
  const currentSprite = currentSprites.length <= 0 ? null : currentSprites[0]

  return (
    <BaseSidebar
      isOpen={isPropertiesSidebarOpen}
      toggleOpen={() => dispatch(toggleProperties())}
      iconRenderer={() => isPropertiesSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      anchor="right"
    >
      <div style={{height: '100vh'}}>
        <Table size="small" style={{width: 'calc(100% - 20px)'}}>
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
            <TableRow key="zIndex">
              <TableCell>z-index</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={currentSprite?.zIndex || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'zIndex', value: e.target.value}))}
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
                  onChange={(e) => dispatch(updateSprite({field: 'duration', value: parseInt(e.target.value)}))}
                />
              </TableCell>
            </TableRow>
            <TableRow key="animationType">
              <TableCell>Animation Type</TableCell>
              <TableCell>
                <Select
                  value={currentSprite?.animationType || ''}
                  onChange={(e) => dispatch(updateSprite({field: 'animationType', value: e.target.value}))}
                  size="small"
                >
                  <MenuItem value="LINEAR">Linear</MenuItem>
                  <MenuItem value="CHAOTIC">Chaotic</MenuItem>
                  <MenuItem value="CIRCULAR">Circular</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
            {currentSprite?.animationType === 'CHAOTIC' && (
              <ChaoticAnimationProperties currentSprite={currentSprite} />
            )}
            {currentSprite?.animationType === 'CIRCULAR' && (<TableRow key="circleDirection">
              <TableCell>Circle Direction</TableCell>
              <TableCell>
                <Select
                  value={currentSprite?.circleDirection || 1}
                  onChange={(e) => dispatch(updateSprite({field: 'circleDirection', value: e.target.value}))}
                  size="small"
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