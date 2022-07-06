import { Stack, Typography } from '@mui/material';
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
    <Stack direction='row' justifyContent='center'>
      <Typography
        component='h1'
        variant='h2'
        align='center'
        color='text.primary'
        marginTop='5%'
        gutterBottom
      >
        {buildSearchHeader(recipesCount, error)}
      </Typography>
    </Stack>
  );
}

const buildSearchHeader = (recipesCount: number | null, error: string | null): string => {
  const parsedRecipesCount = addThousandsSeparator(recipesCount || 0, ',');
  let searchHeader = `${buildPlural('recipe', parsedRecipesCount)} found`;

  if (recipesCount === null) {
    searchHeader = 'Searching recipes...';
  }

  if (error) {
    searchHeader = error;
  }

  return searchHeader;
};
