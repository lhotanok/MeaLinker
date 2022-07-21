export type RecipeJsonld = {
  '@context': string;
  '@type': string;
  mainEntityOfPage: boolean;
  name: string;
  author: string | JsonldName | JsonldName[];
  cookTime: string;
  prepTime: string;
  totalTime: string;
  datePublished: string;
  description: string;
  image: string;
  recipeCategory: string;
  keywords: string;
  recipeIngredient: string[];
  aggregateRating: AggregateRating;
  nutrition: RecipeJsonldNutrition;
  recipeInstructions: RecipeInstruction[];
  recipeYield: string;
  review: Review[];
  publisher: Publisher;
  url: string;
  identifier: string;
};

export type JsonldName = {
  '@type': string;
  'name': string;
};

export type AggregateRating = {
  '@type': string;
  ratingValue: string;
  reviewCount: string;
};

export type RecipeJsonldNutrition = {
  '@type': string;
  calories: string;
  fatContent: string;
  saturatedFatContent: string;
  cholesterolContent: string;
  sodiumContent: string;
  carbohydrateContent: string;
  fiberContent: string;
  sugarContent: string;
  proteinContent: string;
};

export type RecipeInstruction = {
  '@type': string;
  text?: string;
  name?: string;
  itemListElement?: {
    '@type': string;
    text: string;
  }[];
};

export type Review = {
  '@type': string;
  description: string;
  datePublished: string;
  itemReviewed: {
    '@type': string;
    name: string;
  };
  reviewRating: {
    '@type': string;
    worstRating: string;
    ratingValue: number;
    bestRating: string;
  };
  author: string;
};

export type Publisher = {
  '@type': string;
  name: string;
  logo: {
    '@type': string;
    url: string;
  };
  url: string;
};
