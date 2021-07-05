import { AppBar, Button, Toolbar, Typography, useTheme } from '@material-ui/core';
import React from 'react';

interface HeaderProps {
  setIsAnimantionPreviewOpen: (value: boolean) => void,
}

const Header = ({setIsAnimantionPreviewOpen}: HeaderProps) => {
  const theme = useTheme()

  return (
    <AppBar position="static" style={{zIndex: 25}}>
      <Toolbar style={{paddingLeft: theme.spacing(7), paddingRight: theme.spacing(7)}}>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Draw Cells
        </Typography>
        <Button color="inherit">Export</Button>
        <Button color="inherit" onClick={() => setIsAnimantionPreviewOpen(true)}>Preview</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header