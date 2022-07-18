import { Card, CardHeader, CardContent, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { Fragment } from 'react';
import { Category } from '../types/FullIngredient';
import CategoryChips from './CategoryChips';
import IngredientCategory from './IngredientCategory';

type IngredientCategoriesProps = {
  categories: Category[];
};

export default function IngredientCategories({ categories }: IngredientCategoriesProps) {
  const categoriesWithoutIngredients: Category[] = [];
  const categoriesWithIngredients: Category[] = [];

  categories.forEach((category) => {
    if (category.ingredients.length > 0) {
      categoriesWithIngredients.push(category);
    } else {
      categoriesWithoutIngredients.push(category);
    }
  });

  return (
    <Fragment>
      {categories.length > 0 && (
        <Card elevation={0} sx={{ maxWidth: 700 }}>
          <CardHeader title='Categories' />
          <CardContent>
            <Stack spacing={3}>
              {categoriesWithoutIngredients.length > 0 && (
                <CategoryChips categories={categoriesWithoutIngredients} />
              )}
              {categoriesWithIngredients.length > 0 && (
                <Box>
                  {categoriesWithIngredients.map(({ name, ingredients }) => (
                    <IngredientCategory
                      key={name}
                      name={name}
                      ingredients={ingredients}
                    />
                  ))}
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Fragment>
  );
}
