import { DialogActions, DialogContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import React from 'react';

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

  return (
    <div>
      <Dialog fullWidth={true} maxWidth="lg" open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogContent style={{height: `calc(90vh - 50px)`}}>
          <Typography variant="h5">This is the preview</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
