import { Grid, Typography } from '@mui/material';
import CircularLoadingProgress from '../../../shared/components/CircularLoadingProgress';
import {
  addThousandsSeparator,
  buildPlural,
} from '../../../shared/tools/value-prettifier';

type SearchHeaderProps = {
  recipesCount: number | null;
  error: string | null;
};

export default function SearchHeader({ recipesCount, error }: SearchHeaderProps) {
  return (
    <Grid container justifyContent='center'>
      <Grid item>
        <Typography
          component='h1'
          variant='h2'
          align='center'
          color='text.primary'
          gutterBottom
        >
          {buildSearchHeader(recipesCount, error)}
        </Typography>
      </Grid>
      <Grid item pl={2}>
        {recipesCount === null && !error && <CircularLoadingProgress />}
      </Grid>
    </Grid>
  );
}

const buildSearchHeader = (recipesCount: number | null, error: string | null): string => {
  const parsedRecipesCount = addThousandsSeparator(recipesCount || 0);
  let searchHeader = `${buildPlural('recipe', parsedRecipesCount)} found`;

  if (recipesCount === null) {
    searchHeader = 'Searching recipes...';
  }

  if (error) {
    searchHeader = error;
  }

  return searchHeader;
};
