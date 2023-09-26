import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, Theme, Typography, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../stateInterface';
import { removeFrameById, setCurrentFrame } from '../actions';

interface FrameProps {
  title: string,
  id: string | number | null,
  preview?: any
}

const useStyles = makeStyles((theme: Theme) => ({
  selected: {
    border: `solid 1px ${theme.palette.primary.main}`
  },
  unselected: {
    border: `solid 1px ${theme.palette.grey[300]}`
  },
  frame: {
    height: '100%',
    width: '300px'
  }
}))

const Frame = ({title, id, preview}: FrameProps) => {
  const dispatch = useDispatch()
  const currentFrame = useSelector((state: State) => state.frames.currentFrame)
  const classes = useStyles()
  const theme = useTheme()

  const removeFrame = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(removeFrameById({id}))
  }

  return (
    <div
      className={clsx(classes.frame, {[classes.selected]: (id === currentFrame.id), [classes.unselected]: (id !== currentFrame.id)})}
      onClick={() => dispatch(setCurrentFrame(id))}
    >
      <Typography variant="body2" color="textSecondary"> {title} </Typography>
      <div style={{width: '100%', height: "calc(100% - 20px)", overflow: 'hidden'}}>
        {preview && <img src={ preview } alt="Frame Preview" style={{width: '100%'}}/>}
      </div>
      <IconButton
        onClick={removeFrame}
        style={{position: 'absolute', top: -12, right: -3, color: theme.palette.error.main, backgroundColor: 'white', padding: 6}}
        size="large">
        <CancelIcon />
      </IconButton>
    </div>
  );
}

export default Frame
