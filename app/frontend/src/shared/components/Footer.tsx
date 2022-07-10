import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Container, Stack } from '@mui/material';
import FlaticonLink from './FlaticonLink';

const Copyright = () => {
  return (
    <Typography variant='body2' color='text.secondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://github.com/lhotanok/MeaLinker'>
        MeaLinker
      </Link>
      {` ${new Date().getFullYear()}.`}
    </Typography>
  );
};

export default function Footer() {
  return (
    <Container maxWidth='md' component='footer' sx={{ padding: 6 }}>
      <Stack spacing={1.5}>
        <Typography variant='h6' align='center' gutterBottom>
          Bon Appétit!
        </Typography>
        <Typography
          variant='subtitle1'
          align='center'
          color='text.secondary'
          component='p'
        >
          Recipes were collected from various websites. You can find their source pages in
          recipe details.
        </Typography>
        <Typography align='center'>
          <FlaticonLink iconCategory='Carrot' author='Eucalyp' />
          <FlaticonLink iconCategory='Sodium' author='Smashicons' />
          <FlaticonLink iconCategory='Food' author='Freepik' />
          <FlaticonLink iconCategory='Nutrition' author='Freepik' />
          <FlaticonLink iconCategory='Cook' author='Freepik' />
          <FlaticonLink iconCategory='Wheat' author='DinosoftLabs' />
          <FlaticonLink iconCategory='Calories' author='Vitaly Gorbachev' />
          <FlaticonLink iconCategory='Trans fat free' author='Vitaly Gorbachev' />
          <FlaticonLink iconCategory='Protein' author='iconixar' />
          <FlaticonLink iconCategory='Sugar' author='Freepik' />
          <FlaticonLink iconCategory='Cholesterol' author='photo3idea_studio' />
          <FlaticonLink iconCategory='Sodium' author='Smashicons' />
        </Typography>
        <Copyright />
      </Stack>
    </Container>
  );
}
