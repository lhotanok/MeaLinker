import { Grid, Stack, Typography } from '@mui/material';
import HeartRating from '../../../shared/components/HeartRating';
import { buildPlural, escapeAHrefContent } from '../../../shared/tools/value-prettifier';

type RecipeHeaderProps = {
  headline: string;
  description: string;
  rating: {
    value: number;
    reviews: number;
  };
};

export default function RecipeHeader({
  headline = '',
  description = '',
  rating = { value: 0, reviews: 0 },
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
      <Typography color='text.primary'>{escapeAHrefContent(description)}</Typography>
    </Grid>
  );
}
