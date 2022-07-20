import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import mealinkerIcon from '../../assets/icon.png';
import ImageIcon from './ImageIcon';
import { Stack } from '@mui/material';

const pages = [
  {
    name: 'Search Recipes',
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
        window.scrollTo(0, 0);
      }}
      sx={{ color: 'inherit' }}
    >
      {page.name}
    </Button>
  ));

  return (
    <AppBar position='sticky'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters={true} sx={{ width: '100%', maxHeight: '50vh' }}>
          <ImageIcon src={mealinkerIcon} alt='MeaLinker' size={60} />
          <Typography variant='h5' color='inherit' paddingRight='14%'>
            MeaLinker
          </Typography>
          <Stack direction='row'>{menuItems}</Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
