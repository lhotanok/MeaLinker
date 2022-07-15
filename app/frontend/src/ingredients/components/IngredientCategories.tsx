import { Card, CardHeader, CardContent } from '@mui/material';
import { Category } from '../types/FullIngredient';
import IngredientCategory from './IngredientCategory';

type IngredientCategoriesProps = {
  categories: Category[];
};

export default function IngredientCategories({ categories }: IngredientCategoriesProps) {
  return (
    <Card elevation={0} sx={{ maxWidth: 700 }}>
      <CardHeader title='Categories' />
      <CardContent>
        {categories.map(({ name, ingredients }) => (
          <IngredientCategory key={name} name={name} ingredients={ingredients} />
        ))}
      </CardContent>
    </Card>
  );
}
