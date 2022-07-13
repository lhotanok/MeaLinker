import { FilterHandler, FilterHandlers } from '../../../types/Filters';
import InputIngredients from './InputIngredients';
import { Fragment } from 'react';
import SecondaryFilters from './SecondaryFilters';

type InputFiltersProps = {
  filterHandlers: FilterHandlers;
  recipesCount: number | null;
};

export default function InputFilters({
  filterHandlers,
  recipesCount,
}: InputFiltersProps) {
  const normalizedHandlers: Record<string, FilterHandler> = {};

  Object.entries(filterHandlers).forEach(([key, filterHandler]) => {
    normalizedHandlers[key] = {
      ...filterHandler,
      facets: filterHandler.facets.filter((facet) => facet.count !== recipesCount),
    };
  });

  const normalizedFilterHandlers = normalizedHandlers as FilterHandlers;

  return (
    <Fragment>
      <InputIngredients filterHandler={normalizedFilterHandlers.ingredients} />
      <SecondaryFilters filterHandlers={normalizedFilterHandlers} />
    </Fragment>
  );
}
