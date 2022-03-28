import { AppBar, Button, Toolbar, Typography, useTheme } from '@mui/material';
import { signOut } from 'firebase/auth';
import { child, push, ref, set } from 'firebase/database';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
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

  const handleNewPresentation = async () => {
    if(!user) return
    const newPresKey = push(child(ref(db), 'presentations')).key
    set(ref(db, `/presentations/${newPresKey}`), {user_id: user.uid, title: 'New Presentation'})
    set(ref(db, `/user-presentations/${user.uid}/${newPresKey}`), {title: 'New Presentation'})
    navigate(`/presentations/${newPresKey}`)
  }

  return (
    <AppBar position="static" style={{zIndex: 25}}>
      <Toolbar style={{paddingLeft: theme.spacing(7), paddingRight: theme.spacing(7)}}>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Draw Cells
        </Typography>
        {user && (<Button color="inherit" onClick={handleNewPresentation}>New Presentation</Button>)}
        {!user && (<Button color="inherit" onClick={openLoginModal}>Log in</Button>)}
        {user && (<Button color="inherit" onClick={handleLogOut}>Log out</Button>)}
        {user && user.displayName}
      </Toolbar>
    </AppBar>
  )
}

export default HomeHeader