import { RecipeJsonld } from './RecipeJsonld';

export type FullRecipe = {
  _id: string;
  _rev: string;
  jsonld: RecipeJsonld;
  structured: {
    foodComId: string;
    time: RecipeTime;
    servings: string;
    tags: string[];
    rating: {
      value: number;
      reviews: number;
    };
    nutritionInfo: RecipeNutrition;
    ingredients: RecipeIngredient[];
    stepsCount: number;
    author: Author;
  };
};

export type Author = {
  id: string;
  name: string;
  url: string;
};

export type RecipeTime = {
  cooking: PrepTime;
  preparation: PrepTime;
  total: PrepTime;
};

export type PrepTime = {
  minutes?: number;
  hours?: number;
  days?: number;
  weeks?: number;
};

export type RecipeNutrition = {
  calories: Measurable;
  fat: Measurable;
  saturatedFat: Measurable;
  cholesterol: Measurable;
  sodium: Measurable;
  carbohydrate: Measurable;
  fiber: Measurable;
  sugar: Measurable;
  protein: Measurable;
};

export type Measurable = {
  value: number | null;
  unit: string;
};

export type LocalizedValue = {
  '@value': string;
  '@language': string;
};

export type RecipeIngredient = {
  identifier: string;
  foodComId: number;
  name: string;
  amount: string;
  text: string;
  thumbnail?: string;
  label?: LocalizedValue;
  amountValue?: number;
  unit?: string;
  searchValue?: string;
  category?: string;
};
