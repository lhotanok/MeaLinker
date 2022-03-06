import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Copyright = () => {
  return (
    <Typography variant='body2' color='text.secondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='localhost:3000/recipes'>
        MeaLinker
      </Link>
      {` ${new Date().getFullYear()}.`}
    </Typography>
  );
};

export default function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component='footer'>
      <Typography variant='h6' align='center' gutterBottom>
        Bon Appétit!
      </Typography>
      <Typography
        variant='subtitle1'
        align='center'
        color='text.secondary'
        component='p'
      >
        Recipes were collected from various websites. You can get to their
        source pages from recipe details.
      </Typography>
      <Copyright />
    </Box>
  );
}
