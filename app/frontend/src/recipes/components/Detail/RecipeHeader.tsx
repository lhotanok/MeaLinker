import { Grid, Link, Stack, Typography } from '@mui/material';
import HeartRating from '../../../shared/components/HeartRating';
import { buildPlural, escapeAHrefContent } from '../../../shared/tools/value-prettifier';
import { Author } from '../../types/FullRecipe';

type RecipeHeaderProps = {
  headline: string;
  description: string;
  rating: {
    value: number;
    reviews: number;
  };
  author: Author;
};

export default function RecipeHeader({
  headline = '',
  description = '',
  rating = { value: 0, reviews: 0 },
  author = { id: '', name: '', url: '' },
}: RecipeHeaderProps) {
  return (
    <Grid item>
      <Typography component='h1' variant='h4' color='text.primary' gutterBottom>
        {headline}
      </Typography>
      <Stack direction='row' spacing={1.5}>
        <HeartRating value={rating.value} />
        <Typography color='text.secondary'>
          ({buildPlural('review', rating.reviews)})
        </Typography>
      </Stack>
      <Stack direction='row' spacing={0.5}>
        <Typography component='h2' variant='body1' color='text.primary' gutterBottom>
          By
        </Typography>
        <Link href={author.url}>{author.name}</Link>
      </Stack>
      <Typography color='text.primary'>{escapeAHrefContent(description)}</Typography>
    </Grid>
  );
}
