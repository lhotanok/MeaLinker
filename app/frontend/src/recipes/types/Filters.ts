import { FacetItem } from './Facets';

export type Filters = {
  ingredients: string[];
  tags: string[];
  cuisine: string;
};

export type FilterHandlers = {
  ingredients: FilterHandler;
  tags: FilterHandler;
  cuisine: FilterHandler;
};

export type FilterHandler = {
  value: string[] | string;
  facets: FacetItem[];
  onSearch: (labels: string[]) => void;
  onRemove: (removed: string[]) => void;
};
