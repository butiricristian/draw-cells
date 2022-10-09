import React from 'react'
import { removeCurrentSprites, removeCurrentSpritesFromAllFrames, copySelectedSpriteSIntoFrame, } from '../../Frames/actions';
import { NestedMenuItem } from 'mui-nested-menu';
import { Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import State from '../../stateInterface';

const initialMenuState: any = {
  mouseX: null,
  mouseY: null,
};

export default function ContextMenu({menuState, setMenuState}: any) {
  const handleClose = () => {
    setMenuState(initialMenuState);
  };
  const dispatch = useDispatch()
  const framesList = useSelector((state: State) => state.frames.frames)

  return (
    <Menu
      id="simple-menu"
      open={menuState.mouseY !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        menuState.mouseY !== null && menuState.mouseX !== null
          ? { top: menuState.mouseY, left: menuState.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={() => dispatch(removeCurrentSprites())}>Remove from crt. frame</MenuItem>
      <MenuItem onClick={() => dispatch(removeCurrentSpritesFromAllFrames())}>Remove from all frames</MenuItem>
      <NestedMenuItem
        label="Copy selected sprites into"
        parentMenuOpen={menuState.mouseY !== null}
        disabled={framesList.length < 1}
      >
        {framesList.map(f => (
          <MenuItem key={`copy-selected-into-${f.id}`} onClick={() => dispatch(copySelectedSpriteSIntoFrame(f.id || ''))}>Frame {f.id}</MenuItem>
        ))}
      </NestedMenuItem>
    </Menu>
  )
}