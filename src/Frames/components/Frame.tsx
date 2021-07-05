import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import State from '../../stateInterface'
import { setCurrentFrame } from '../actions'

interface FrameProps {
  title: string,
  id: string | number | null,
}

const useStyles = makeStyles((theme) => ({
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

const Frame = ({title, id}: FrameProps) => {
  const dispatch = useDispatch()
  const currentFrameId = useSelector((state: State) => state.frames.currentFrame.id)
  const classes = useStyles()

  return (
    <div 
      className={clsx(classes.frame, {[classes.selected]: (id === currentFrameId), [classes.unselected]: (id !== currentFrameId)})}
      onClick={() => dispatch(setCurrentFrame(id))}
    >
      <Typography variant="body2" color="textSecondary"> {title} </Typography>
    </div>
  )
}

export default Frame