import { Menu, MenuItem } from '@material-ui/core';
import React from 'react';
import Draggable from 'react-draggable';

interface Position {
  x: number,
  y: number,
}

interface BaseSpriteProps {
  position: Position
}

interface StateProps {
  mouseX: number | null,
  mouseY: number | null,
}

const initialState: StateProps = {
  mouseX: null,
  mouseY: null,
};

export default function BaseSprite({position}: BaseSpriteProps) {
  const [state, setState] = React.useState(initialState);

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

  return (
    <>
      <Draggable>
        <div onContextMenu={handleClick} style={{width: 50, height: 50, backgroundColor: '#252525', cursor: 'pointer', position: 'absolute', left: position.x, top: position.y}}>
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