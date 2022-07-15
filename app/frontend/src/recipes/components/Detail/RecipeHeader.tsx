import { Grid, Link, Stack, Typography } from '@mui/material';
import HeartRating from '../../../shared/components/HeartRating';
import { buildPlural, escapeAHrefContent } from '../../../shared/tools/value-prettifier';
import { Author } from '../../types/FullRecipe';
import { JsonldName } from '../../types/RecipeJsonld';

type RecipeHeaderProps = {
  headline: string;
  description: string;
  rating: {
    value: number;
    reviews: number;
  };
  author: Author | JsonldName | JsonldName[];
};

export default function RecipeHeader({
  headline = '',
  description = '',
  rating = { value: 0, reviews: 0 },
  author = { id: '', name: '', url: '' },
}: RecipeHeaderProps) {
  const authorStructured = Array.isArray(author) ? author[0] : author;
  const namedAuthor = { url: '', ...authorStructured };

  return (
    <Grid item>
      <Typography component='h1' variant='h4' color='text.primary' gutterBottom>
        {headline}
      </Typography>
      <Stack direction='row' spacing={1.5}>
        <HeartRating value={rating.value} />
        <Typography color='text.secondary'>
          ({buildPlural('review', rating.reviews | 0)})
        </Typography>
      </Stack>
      <Stack direction='row' spacing={0.5}>
        <Typography component='h2' variant='body1' color='text.primary' gutterBottom>
          By {!namedAuthor.url && namedAuthor.name}
        </Typography>
        {namedAuthor.url && <Link href={namedAuthor.url}>{namedAuthor.name}</Link>}
      </Stack>
      <Typography color='text.primary'>{escapeAHrefContent(description)}</Typography>
    </Grid>
  );
}
