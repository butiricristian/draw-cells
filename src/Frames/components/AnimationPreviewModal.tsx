import { DialogActions, DialogContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../stateInterface';
import { updateCurrentSpritePosition } from '../actions';
import AnimationContainer from './AnimationContainer';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AnimationPreviewModalProps {
  open: boolean,
  setOpen: (value: boolean) => void,
}

export default function AnimationPreviewModal({open, setOpen}: AnimationPreviewModalProps) {
  const handleClose = () => {
    setOpen(false);
  };
  const framesList = useSelector((state: State)  => state.frames.frames)

  return (
    <div>
      <Dialog fullWidth={true} maxWidth="lg" open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogContent style={{height: `calc(90vh - 50px)`}}>
          <AnimationContainer/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
