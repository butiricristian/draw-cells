import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { SPRITE_TO_SVG_ELEMENT_MAP } from '../constants';
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
  sprite: {
    border: 'dashed 2px transparent',
    borderWidth: 2,
    width: '100%',
    height: '100%',
    margin: 3,
    '& svg': {
      height: '100%',
      width: '100%'
    }
  },
  selected: {
    border: 'dashed 2px red',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  spriteContainer: {
    position: 'absolute',
    cursor: 'pointer',
    width: 50,
    height: 50, 
  }
})

export default function BaseSprite({position, id, backgroundUrl, scale}: Sprite) {
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

  if (isDragging) {
    return (<div ref={canvasSpriteDrag} style={{position: 'absolute'}}/>)
  }

  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP
  
  return (
    <div ref={canvasSpriteDrag} className={classes.spriteContainer} style={{left: position.x, top: position.y}}>
      <div 
        className={clsx(classes.sprite, {[classes.selected]: id === currentSpriteId})}
        style={{backgroundColor: 'transparent', transform: `scale(${scale})`}}
        onContextMenu={handleClick}
        onClick={handleSelectSprite}
      >
        {backgroundUrl && spriteToSvgMap[backgroundUrl]}
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