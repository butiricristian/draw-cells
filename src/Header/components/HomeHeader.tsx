import { AppBar, Button, Toolbar, Typography, useTheme } from '@mui/material';
import { signOut } from 'firebase/auth';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { toggleLoginModalOpen } from '../../Home/reducers';
import State from '../../stateInterface';

// interface HeaderProps {
// }

const HomeHeader = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: State) => state.home.user)

  const openLoginModal = () => {
    dispatch(toggleLoginModalOpen(true))
  }

  const handleLogOut = () => {
    signOut(auth)
  }

  return (
    <AppBar position="static" style={{zIndex: 25}}>
      <Toolbar style={{paddingLeft: theme.spacing(7), paddingRight: theme.spacing(7)}}>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Draw Cells
        </Typography>
        <Button color="inherit" onClick={() => navigate('/canvas')}>New Presentation</Button>
        {!user && (<Button color="inherit" onClick={openLoginModal}>Log in</Button>)}
        {user && (<Button color="inherit" onClick={handleLogOut}>Log out</Button>)}
        {user && user.displayName}
      </Toolbar>
    </AppBar>
  )
}

export default HomeHeader