import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, Theme, Typography, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { render } from 'react-dom';
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
  const currentFrameId = useSelector((state: State) => state.frames.currentFrame.id)
  const classes = useStyles()
  const theme = useTheme()

  const removeFrame = () => {
    dispatch(removeFrameById({id}))
  }

  return (
    <div
      className={clsx(classes.frame, {[classes.selected]: (id === currentFrameId), [classes.unselected]: (id !== currentFrameId)})}
      onClick={() => dispatch(setCurrentFrame(id))}
    >
      <Typography variant="body2" color="textSecondary"> {title} </Typography>
      <div style={{width: '100%', height: "calc(100% - 20px)", overflow: 'hidden'}}>
        {preview && <img src={ preview.toDataURL("image/png", 1.0) } alt="Frame Preview" style={{width: '100%'}}/>}
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