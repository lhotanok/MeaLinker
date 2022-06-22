import { Stack, Typography } from '@mui/material';
import {
  addThousandsSeparator,
  buildPlural,
} from '../../../shared/tools/value-prettifier';

type SearchHeaderProps = {
  recipesCount: number | null;
};

export default function SearchHeader({ recipesCount }: SearchHeaderProps) {
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
        {buildSearchHeader(recipesCount)}
      </Typography>
    </Stack>
  );
}

const buildSearchHeader = (recipesCount: number | null): string => {
  const parsedRecipesCount = addThousandsSeparator(recipesCount || 0, ',');
  let searchHeader = `${buildPlural('recipe', parsedRecipesCount)} found`;

  if (recipesCount === null) {
    searchHeader = 'Searching recipes...';
  }

  return searchHeader;
};
