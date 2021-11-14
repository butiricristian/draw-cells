import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import NestedMenuItem from 'material-ui-nested-menu-item';
import React, { MouseEvent, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { SPRITE_TO_SVG_ELEMENT_MAP } from '../constants';
import { addCurrentSprite, copySelectedSpriteSIntoFrame, copySpriteIntoFrame, removeCurrentSprites, removeCurrentSpritesFromAllFrames, removeSprite, removeSpriteFromAllFrames, setCurrentSprite } from '../Frames/actions';
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
  const frames = useSelector((state: State) => state.frames.frames)
  const framesForSelect = frames.filter(f => f.sprites.map(s => s.id).indexOf(id) < 0)
  const currentSpriteIds = useSelector((state: State) => state.frames.currentSprites.map(s => s.id))
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
  const handleSelectSprite = (e: MouseEvent) => {
    if (e.metaKey) {
      dispatch(addCurrentSprite(id))
    } else {
      dispatch(setCurrentSprite(id))
    }
  }

  const [{isDragging}, canvasSpriteDrag, preview] = useDrag(() => ({
    type: 'SPRITE',
    item: { type: 'CANVAS_SPRITE', id, x: position.x, y: position.y, backgroundUrl, scale },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [position, scale])

  useEffect(() => {
    preview(getEmptyImage(), {captureDraggingState: true});
  }, [preview]);

  const spriteToSvgMap: any = SPRITE_TO_SVG_ELEMENT_MAP
  
  return (
    <div ref={canvasSpriteDrag} className={classes.spriteContainer} style={{left: position.x, top: position.y, transform: `scale(${scale})`, opacity: isDragging ? 0 : 1}}>
      <div 
        className={clsx(classes.sprite, {[classes.selected]: currentSpriteIds.find(sId => sId === id)})}
        style={{backgroundColor: 'transparent'}}
        onContextMenu={handleClick}
        onClick={(e) => handleSelectSprite(e)}
      >
        {backgroundUrl && spriteToSvgMap[backgroundUrl]}
      </div>
      <Menu
        id="simple-menu"
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => dispatch(removeSprite(id || ''))}>Remove from crt. frame</MenuItem>
        <MenuItem onClick={() => dispatch(removeCurrentSprites())}>Remove selected from crt. frame</MenuItem>
        <MenuItem onClick={() => dispatch(removeSpriteFromAllFrames(id || ''))}>Remove from all frames</MenuItem>
        <MenuItem onClick={() => dispatch(removeCurrentSpritesFromAllFrames())}>Remove selected from all frames</MenuItem>
        <NestedMenuItem 
          label="Copy sprite into"
          parentMenuOpen={state.mouseY !== null}
          disabled={framesForSelect.length < 1}
        >
          {framesForSelect.map(f => (
            <MenuItem key={`copy-into-${f.id}`} onClick={() => dispatch(copySpriteIntoFrame(id || '', f.id || ''))}>Frame {f.id}</MenuItem>
          ))}
        </NestedMenuItem>
        <NestedMenuItem 
          label="Copy selected sprites into"
          parentMenuOpen={state.mouseY !== null}
          disabled={framesForSelect.length < 1}

        >
          {framesForSelect.map(f => (
            <MenuItem key={`copy-selected-into-${f.id}`} onClick={() => dispatch(copySelectedSpriteSIntoFrame(f.id || ''))}>Frame {f.id}</MenuItem>
          ))}
        </NestedMenuItem>
      </Menu>
    </div>
  );
}