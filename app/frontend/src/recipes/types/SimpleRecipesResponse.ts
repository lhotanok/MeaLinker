import { Facets } from './Facets';

export type SimpleRecipe = {
  id: string;
  name: string;
  image: string;
  description: string;
  stepsCount: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  cuisine: string;
  diets: string[];
  ingredients: string[];
  time: string[];
  cookMinutes: number;
  prepMinutes: number;
  totalMinutes: number;
  date: string;
  calories: number;
  fat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  carbohydrate: number;
  fiber: number;
  sugar: number;
  protein: number;
  _version_: number;
  _ingredientsFacet: string[];
};

export type HighlightedFields = {
  ingredients?: string[];
};

export type SimpleRecipesResponse = {
  docs: SimpleRecipe[];
  totalCount: number;
  facets: Facets;
  highlighting?: Record<string, HighlightedFields>;
};
