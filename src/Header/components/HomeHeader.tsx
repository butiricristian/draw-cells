import { AccountCircle, ArrowDropDown } from '@mui/icons-material';
import { AppBar, Button, Menu, MenuItem, Stack, Toolbar, Typography, useTheme } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openLoginModal = () => {
    dispatch(toggleLoginModalOpen(true))
  }

  const handleLogOut = () => {
    signOut(auth)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <Stack direction="row" style={{flexGrow: 1}} alignItems="center">
          <Typography variant="h6">
            Draw Cells
          </Typography>
          {user && (<Button color="inherit" onClick={handleNewPresentation}>New Presentation</Button>)}
        </Stack>
        {!user && (<Button color="inherit" onClick={openLoginModal}>Log in</Button>)}
        {user && (
          <>
            <Button onClick={(e: any) => setAnchorEl(e.currentTarget)} sx={{color: 'white'}} startIcon={<AccountCircle />} endIcon={<ArrowDropDown />}>
              {user.displayName}
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogOut}>Log out</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default HomeHeader