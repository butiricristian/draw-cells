import { Typography } from '@material-ui/core';
import { List } from '@material-ui/core';
import React from 'react';

interface PropertiesSidebarProps{
  width: number,
}

export default function PropertiesSidebar({width}: PropertiesSidebarProps) {
  return (
    <div style={{borderLeft: 'solid 1px #ddd', width: width, height: '100vh'}}>
      <Typography variant="subtitle1">Properties</Typography>
      <List>

      </List>
    </div>
  );
}