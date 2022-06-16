import { SearchedIngredient } from './SearchedIngredient';
import { SimpleRecipe } from './SimpleRecipe';

export interface SearchedRecipe extends SimpleRecipe {
  searchedIngredients: SearchedIngredient[];
}
