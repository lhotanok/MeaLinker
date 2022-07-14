import { FacetItem } from './Facets';

export type Filters = {
  ingredients: string[];
  tags: string[];
  cuisine: string;
  diets: string[];
  mealTypes: string[];
  time: string[];
};

export type FilterHandlers = {
  ingredients: FilterHandler;
  tags: FilterHandler;
  cuisine: FilterHandler;
  time: FilterHandler;
  diets: FilterHandler;
  mealTypes: FilterHandler;
};

export type FilterHandler = {
  value: string[] | string;
  facets: FacetItem[];
  onSearch: (labels: string[]) => void;
  onRemove: (removed: string[]) => void;
};

export type FilterName =
  | 'ingredients'
  | 'tags'
  | 'cuisine'
  | 'time'
  | 'diets'
  | 'mealTypes';
