import { IconButton, List, ListItem, makeStyles, Menu, MenuItem } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFrame } from '../../Frames/actions';
import Frame from '../../Frames/components/Frame';
import State from '../../stateInterface';
import { toggleFrames } from '../actions';
import SidebarInterface from '../interfaces/SidebarInterface';
import BaseSidebar from './BaseSidebar';

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: 'calc(100% - 25px)',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 25
  }
})

interface StateProps {
  mouseX: number | null,
  mouseY: number | null,
}

const initialState: StateProps = {
  mouseX: null,
  mouseY: null,
};

export default function FramesSidebar({width}: SidebarInterface) {
  const dispatch = useDispatch()
  const isFramesSidebarOpen = useSelector((state: State) => state.sidebars.isFramesOpen)
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const [state, setState] = React.useState(initialState);
  const framesList = useSelector((state: State) => state.frames.frames)
  const classes = useStyles()

  const handleAddFrame = () => {
    const newFrame = {
      id: framesList.length + 1,
      title: `Frame ${framesList.length + 1}`,
      sprites: []
    }
    dispatch(addFrame(newFrame))
    handleClose()
  }

  const handleCloneSelected = () => {
    const newFrame = {
      id: framesList.length + 1,
      title: `Frame ${framesList.length + 1}`,
      sprites: [...currentFrame.sprites]
    }
    dispatch(addFrame(newFrame))
    handleClose()
  }

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
    <BaseSidebar 
      isOpen={isFramesSidebarOpen} 
      toggleOpen={() => dispatch(toggleFrames())}
      iconRenderer={() => isFramesSidebarOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      anchor="bottom"
    >
      <div className={classes.container}>
        <List style={{height: 'calc(100% - 50px)', display: 'inline-flex', overflowX: 'auto'}}>
          {framesList.map(f => (
            <ListItem key={`frame-${f.id}`} style={{height: '100%'}}>
              <Frame id={f.id} title={f.title} />
            </ListItem>
          ))}
          <ListItem style={{height: '100%'}}>
            <IconButton color="primary" style={{display: 'flex', alignItems: 'center', fontSize: '4em'}} onClick={handleClick}>
              <AddCircleOutlineIcon fontSize="inherit"/>
            </IconButton>
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
              <MenuItem onClick={handleAddFrame}>New Frame</MenuItem>
              <MenuItem onClick={handleCloneSelected}>Clone Selected</MenuItem>
            </Menu>
          </ListItem>
        </List>
      </div>
    </BaseSidebar>
  );
}