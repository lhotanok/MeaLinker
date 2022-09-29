import { Card, CardHeader, CardContent, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { Fragment } from 'react';
import { Category } from '../types/FullIngredient';
import CategoryChips from './CategoryChips';
import IngredientCategory from './IngredientCategory';

type IngredientCategoriesProps = {
  ingredientName: string;
  categories: Category[];
};

export default function IngredientCategories({
  ingredientName,
  categories,
}: IngredientCategoriesProps) {
  const categoriesWithoutIngredients: Category[] = [];
  const categoriesWithIngredients: Category[] = [];

  categories.forEach((category) => {
    if (category.name === ingredientName) {
      return;
    }

    // hotfix
    const ingredients = category.ingredients
      .filter((ingredient) => ingredient.name !== ingredientName)

    if (ingredients.length > 0) {
      categoriesWithIngredients.push({ ...category, ingredients });
    } else {
      categoriesWithoutIngredients.push({ ...category, ingredients });
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
