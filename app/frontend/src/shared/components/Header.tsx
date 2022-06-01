import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Icon from './Icon';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const menuItems = pages.map((page) => (
    <Button
      key={page.name}
      size='large'
      variant='contained'
      disableElevation
      onClick={() => {
        navigate(page.path);
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
