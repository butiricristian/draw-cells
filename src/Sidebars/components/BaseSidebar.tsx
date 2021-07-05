import { IconButton, useTheme } from '@material-ui/core';
import React from 'react';

const drawerWidth = 240;
const bottomDrawerHeight = 240;

interface BaseSidebarProps {
  isOpen: boolean,
  toggleOpen: () => void,
  children: any,
  iconRenderer: () => any,
  anchor: 'bottom' | 'right' | 'left',
}

export default function BaseSidebar({isOpen, toggleOpen, children, iconRenderer, anchor}: BaseSidebarProps) {
  const theme = useTheme()

  const leftIconStyle = {
    right: 0,
    top: 0,
  }
  const rightIconStyle = {
    left: 0,
    top: 0,
  }

  let styles = {}
  if (anchor === 'left') {
    styles = {
      top: 0,
      left: 0,
      height: '100vh',
      width: isOpen ? drawerWidth : theme.spacing(9),
      borderRight: 'solid 1px #ddd',
      transition: 'width 0.3s ease-out',
      zIndex: 5,
    }
  } else if (anchor === 'right') {
    styles = {
      top: 0,
      right: 0,
      height: '100vh',
      width: isOpen ? drawerWidth : theme.spacing(9),
      borderLeft: 'solid 1px #ddd',
      transition: 'width 0.3s ease-out',
      zIndex: 5,
    }
  } else if (anchor === 'bottom') {
    styles = {
      bottom: 0,
      left: 0,
      right: 20,
      height: isOpen ? bottomDrawerHeight : theme.spacing(9),
      width: 'calc(100% - 144px)',
      marginLeft: 73,
      borderTop: 'solid 1px #ddd',
      transition: 'height 0.3s ease-out',
      zIndex: 1,
    }
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          background: "#fff",
          ...styles
        }}
      >
        <div style={{position: 'absolute', ...(anchor === "left" || anchor === "bottom" ? leftIconStyle : rightIconStyle)}}>
          <IconButton onClick={toggleOpen}>
            {iconRenderer()}
          </IconButton>
        </div>
        {isOpen && children}
      </div>
    </>
  );
}