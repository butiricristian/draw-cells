import { Dialog, IconButton, Slide, Typography } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import State from '../../stateInterface'
import { toggleModal } from '../actions';
import { TransitionProps } from '@material-ui/core/transitions';
import PresentationContainer from './PresentationContainer';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close'


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    }
  }
})

const PresentationModal = () => {
  const open = useSelector((state: State) => state.presentations.isModalOpen)
  const dispatch = useDispatch()
  const classes = useStyles()

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => dispatch(toggleModal(false))}
      TransitionComponent={Transition}
      className={classes.dialog}
      style={{marginTop: 80}}
    >
      <div style={{padding: '10px 50px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Typography variant="h6">Presentation Preview</Typography>
        <IconButton style={{padding: 6}} onClick={() => dispatch(toggleModal(false))}>
          <CloseIcon fontSize="small"/>
        </IconButton>
      </div>
      <PresentationContainer />
    </Dialog>
  )
}

export default PresentationModal