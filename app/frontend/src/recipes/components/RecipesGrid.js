import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Footer from '../../shared/Footer';
import RecipeCard from './RecipeCard';
import Header from '../../shared/Header';

const DUMMY_CARDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const DUMMY_SEARCHED_INGREDIENTS = ['bacon', 'cheddar'];

const DUMMY_RECIPE = {
  searchedIngredients: DUMMY_SEARCHED_INGREDIENTS.map((ingredient) =>
    ingredient.toLocaleLowerCase(),
  ),
  title: 'Slow Cooked Bacon Cheese Potatoes',
  description: `Honestly don't know how I came be this recipe other than I printed it out because I thought it looked good and it gave the alternative of cooking in the oven.`,
  date: 'February 27, 2014',
  rating: 4.5,
  image:
    'https://img.sndimg.com/food/image/upload/q_92,fl_progressive,w_1200,c_scale/v1/img/recipes/51/37/69/QjAmeeCQKGquX87Uf9zM_0S9A2936.jpg',
  ingredients: [
    '200 g bacon (diced)',
    '2 medium onions (thinly sliced)',
    '4 medium potatoes (thinly sliced)',
    '225 g cheddar cheese (thinly sliced)',
    'salt (to taste)',
    'pepper (to taste)',
    'butter (use your discretion)',
    'spring onion (green onions) (optional)',
  ],
};

export default function RecipesGrid() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Header />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth='sm'>
            <Typography
              component='h1'
              variant='h2'
              align='center'
              color='text.primary'
              gutterBottom
            >
              Found {DUMMY_CARDS.length} recipes
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction='row'
              spacing={2}
              justifyContent='center'
            >
              {DUMMY_SEARCHED_INGREDIENTS.map((ingredient) => (
                <Button variant='contained'>{ingredient}</Button>
              ))}
            </Stack>
          </Container>
        </Box>
        <Container maxWidth='md'>
          <Grid container spacing={4}>
            {DUMMY_CARDS.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <RecipeCard {...DUMMY_RECIPE} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
}
