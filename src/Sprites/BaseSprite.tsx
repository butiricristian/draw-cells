import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSprite, updateCurrentSpritePosition } from '../Frames/actions';
import { Position, Sprite } from '../Frames/reducers/frames';
import State from '../stateInterface';

interface StateProps {
  mouseX: number | null,
  mouseY: number | null,
}

const initialState: StateProps = {
  mouseX: null,
  mouseY: null,
};

const useStyles = makeStyles({
  selected: {
    border: 'dashed 2px red',
    width: '100%',
    height: '100%',
    position: 'absolute',
    padding: 1
  },
  sprite: {
    backgroundColor: '#252525',
    width: '100%',
    height: '100%',
    margin: 3
  },
  spriteContainer: {
    position: 'absolute',
    cursor: 'pointer',
    width: 50,
    height: 50, 
  }
})

export default function BaseSprite({position, id}: Sprite) {
  const [state, setState] = React.useState(initialState);
  const currentSpriteId = useSelector((state: State) => state.frames.currentSprite?.id)
  const classes = useStyles()

  const handleClick = (event: any) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
  };

  const dispatch = useDispatch()
  const handleSelectSprite = () => {
    dispatch(setCurrentSprite(id))
  }

  const handleOnStop = (e: any, data: DraggableData) => {
    const pos: Position = {x: position.x + e.offsetX, y: position.y + e.offsetY}
    dispatch(updateCurrentSpritePosition(id, pos))
  }

  return (
    <>
      <Draggable bounds="parent" onStop={handleOnStop}>
        <div className={classes.spriteContainer} style={{left: position.x, top: position.y}}>
          <div 
            className={clsx({[classes.selected]: id === currentSpriteId})} 
            style={{backgroundColor: 'transparent'}}
          >
          </div>
          <div 
            onContextMenu={handleClick}
            className={classes.sprite}
            onClick={handleSelectSprite}
          >
          </div>
        </div>
      </Draggable>
      <Menu
        id="simple-menu"
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => console.log("Item 1")}>Profile</MenuItem>
        <MenuItem onClick={() => console.log("Item 1")}>My account</MenuItem>
        <MenuItem onClick={() => console.log("Item 1")}>Logout</MenuItem>
      </Menu>
    </>
  );
}