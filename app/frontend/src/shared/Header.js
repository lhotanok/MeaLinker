import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Icon from './Icon';

export default function Header() {
  return (
    <AppBar position='relative'>
      <Toolbar>
        <Icon />
        <Typography variant='h6' color='inherit' noWrap>
          MeaLinker
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
