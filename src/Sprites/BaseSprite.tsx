import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';
import { setCurrentSprite } from '../Frames/actions';
import { Sprite } from '../Frames/reducers/frames';
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

export default function BaseSprite({position, id, backgroundUrl}: Sprite) {
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

  const [{isDragging}, canvasSpriteDrag] = useDrag(() => ({
    type: 'SPRITE',
    item: { type: 'CANVAS_SPRITE', id, x: position.x, y: position.y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [position])

  const props = useSpring({to: {left: position.x, top: position.y}})

  if (isDragging) {
    return (<div ref={canvasSpriteDrag} style={{position: 'absolute'}}/>)
  }
  
  return (
    <div ref={canvasSpriteDrag} className={classes.spriteContainer} style={{left: position.x, top: position.y}}>
      <div 
        className={clsx({[classes.selected]: id === currentSpriteId})}
        style={{backgroundColor: 'transparent', backgroundImage: `url('/assets/${backgroundUrl}.svg')`, height: '100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
      >
      </div>
      <div 
        onContextMenu={handleClick}
        className={classes.sprite}
        onClick={handleSelectSprite}
        style={{width: '100%', height: '100%'}}
      >
      </div>
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
    </div>
  );
}