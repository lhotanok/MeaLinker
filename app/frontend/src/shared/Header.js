// import React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import { NavLink } from 'react-router-dom';
// import Icon from './Icon';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

// export default function Header() {
//   const [anchorElNav, setAnchorElNav] = React.useState(null);

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   return (
//     <AppBar position='relative'>
//       <Toolbar>
//         <Icon />
//         <Typography variant='h6' color='inherit' noWrap>
//           MeaLinker
//         </Typography>
//         <Menu
//           id='menu-appbar'
//           anchorEl={anchorElNav}
//           anchorOrigin={{
//             vertical: 'bottom',
//             horizontal: 'left',
//           }}
//           keepMounted
//           transformOrigin={{
//             vertical: 'top',
//             horizontal: 'left',
//           }}
//           open={Boolean(anchorElNav)}
//           onClose={handleCloseNavMenu}
//           sx={{
//             display: { xs: 'block', md: 'none' },
//           }}
//         >
//           <MenuItem key='Search Recipes'>
//             <Typography textAlign='center'>
//               <NavLink to='/recipes'>Search Recipes</NavLink>
//             </Typography>
//             {/* <NavLink to='/recipes'>
//               <Typography textAlign='center'>Search Recipes</Typography>
//             </NavLink> */}
//           </MenuItem>
//         </Menu>
//       </Toolbar>
//     </AppBar>
//   );
// }

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Icon from './Icon';
import { useHistory } from 'react-router-dom';

const pages = [
  {
    name: 'Search Recipes',
    path: '/recipes',
  },
  {
    name: 'Cusines', // just a testing menu tab
    path: '/recipes',
  },
];

export default function Header() {
  const history = useHistory();

  const menuItems = pages.map((page) => (
    <Button
      key={page.name}
      size='large'
      variant='contained'
      disableElevation
      onClick={() => {
        history.push(page.path);
      }}
      sx={{ padding: 2.5, color: 'inherit' }}
    >
      {page.name}
    </Button>
  ));

  return (
    <AppBar position='relative'>
      <Container>
        <Toolbar>
          <Icon />
          <Typography variant='h5' color='inherit' paddingRight='14%'>
            MeaLinker
          </Typography>
          <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>{menuItems}</Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
