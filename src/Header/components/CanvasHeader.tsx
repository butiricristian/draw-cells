import { AppBar, Box, Button, Toolbar, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleModal } from '../../Presentation/actions';

// interface HeaderProps {
// }

const CanvasHeader = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <AppBar position="static" style={{zIndex: 25}}>
      <Toolbar style={{paddingLeft: theme.spacing(7), paddingRight: theme.spacing(7)}}>
        <Box style={{flexGrow: 1, display: 'flex'}} alignItems="center">
          <Typography variant="h6">
            Draw Cells
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>HOME</Button>
        </Box>
        <Button color="inherit" onClick={() => dispatch(toggleModal(true))}>PREVIEW</Button>
        <Button color="inherit" onClick={() => console.log('GET PRESENTATION LINK')}>Get presentation link</Button>
      </Toolbar>
    </AppBar>
  )
}

export default CanvasHeader