import { AppBar, Button, Toolbar, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleModal } from '../Presentation/actions';

// interface HeaderProps {
// }

const Header = () => {
  const theme = useTheme()
  const dispatch = useDispatch()

  return (
    <AppBar position="static" style={{zIndex: 25}}>
      <Toolbar style={{paddingLeft: theme.spacing(7), paddingRight: theme.spacing(7)}}>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Draw Cells
        </Typography>
        <Button color="inherit" onClick={() => dispatch(toggleModal(true))}>PREVIEW</Button>
        <Button color="inherit" onClick={() => console.log('GET PRESENTATION LINK')}>Get presentation link</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header