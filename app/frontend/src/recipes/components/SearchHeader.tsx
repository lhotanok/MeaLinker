import { Typography } from '@mui/material';

type SearchHeaderProps = {
  recipesCount: number | null;
  ingredientsCount: number;
};

export default function SearchHeader({
  recipesCount,
  ingredientsCount,
}: SearchHeaderProps) {
  return (
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
  );
}

const buildSearchHeader = (
  recipesCount: number | null,
  ingredientsCount: number,
): string => {
  let searchHeader = `Found ${recipesCount} recipe${recipesCount === 1 ? '' : 's'}`;

  if (ingredientsCount > 0 && recipesCount === null) {
    searchHeader = 'Searching recipes...';
  } else if (ingredientsCount === 0) {
    searchHeader = 'Add some ingredients';
  }

  return searchHeader;
};
