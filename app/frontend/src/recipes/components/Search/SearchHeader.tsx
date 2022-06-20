import { Stack, Typography } from '@mui/material';
import { addThousandsSeparator } from '../../../shared/tools/value-prettifier';

type SearchHeaderProps = {
  recipesCount: number | null;
  ingredientsCount: number;
};

export default function SearchHeader({
  recipesCount,
  ingredientsCount,
}: SearchHeaderProps) {
  return (
    <Stack direction='row' justifyContent='center'>
      {/* <Typography
        component='h1'
        variant='h2'
        align='center'
        marginTop='5%'
        gutterBottom
        color='secondary'
      >
        678
      </Typography> */}
      <Typography
        component='h1'
        variant='h2'
        align='center'
        color='text.primary'
        marginTop='5%'
        gutterBottom
      >
        {buildSearchHeader(recipesCount, ingredientsCount)}
      </Typography>
    </Stack>
  );
}

const buildSearchHeader = (
  recipesCount: number | null,
  ingredientsCount: number,
): string => {
  const parsedRecipesCount = addThousandsSeparator(recipesCount || 0, ',');
  let searchHeader = `${parsedRecipesCount} recipe${recipesCount === 1 ? '' : 's'} found`;

  if (ingredientsCount > 0 && recipesCount === null) {
    searchHeader = 'Searching recipes...';
  } else if (ingredientsCount === 0) {
    searchHeader = 'Add some ingredients';
  }

  return searchHeader;
};
