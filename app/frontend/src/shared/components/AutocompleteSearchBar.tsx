import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { MAX_ITEMS_FOR_FAST_AUTOCOMPLETE_RENDERING } from '../constants';
import { FacetItem } from '../../recipes/types/Facets';
import {
  buildItemsWithCount,
  buildPlural,
  getItemsWithoutCount,
  getItemWithoutCount,
} from '../tools/value-prettifier';
import { Fragment } from 'react';

type AutocompleteSearchBarProps = {
  facetItems: FacetItem[];
  searched: string | string[];
  label: string;
  placeholder: string;
  limitTags?: number;
  multiple?: boolean;
  searchIcon?: JSX.Element;
  onSearch: (searchedItems: string[]) => void;
  onRemove: (removedItems: string[]) => void;
};

export default function AutocompleteSearchBar({
  searched,
  facetItems,
  label,
  placeholder,
  limitTags = 5,
  multiple = true,
  searchIcon = <SearchIcon color='secondary' />,
  onSearch,
  onRemove,
}: AutocompleteSearchBarProps) {
  const onChangeHandler = (
    _ev: React.SyntheticEvent<Element, Event>,
    value: string | string[] | null,
  ) => {
    if (Array.isArray(searched)) {
      const normalizedValue = value ? value : [];
      const values = Array.isArray(normalizedValue) ? normalizedValue : [normalizedValue];
      const filteredValues: string[] = values.filter((value) => value);

      const itemsWithoutCount = getItemsWithoutCount(filteredValues);

      console.log(
        `normalizedValue: ${normalizedValue}, values: ${values}, filteredValues: ${filteredValues}, itemsWithoutCount: ${itemsWithoutCount}`,
      );

      if (filteredValues.length <= searched.length) {
        const removedItems = searched.filter((item) => !filteredValues.includes(item));
        onRemove(getItemsWithoutCount(removedItems));
      } else {
        onSearch(itemsWithoutCount);
      }
    } else if (typeof value === 'string') {
      if (searched) {
        onRemove([searched]);
      }
      console.log(
        `Removed and searching, ${JSON.stringify(searched)} and ${JSON.stringify(value)}`,
      );
      onSearch(getItemsWithoutCount([value]));
    }
  };

  return (
    <Autocomplete
      freeSolo
      multiple={multiple}
      selectOnFocus
      clearOnBlur
      clearOnEscape
      options={buildItemsWithCount(facetItems)}
      limitTags={limitTags}
      onChange={onChangeHandler}
      value={multiple ? searched : Array.isArray(searched) ? searched[0] : searched}
      filterOptions={createFilterOptions({
        limit: MAX_ITEMS_FOR_FAST_AUTOCOMPLETE_RENDERING,
      })}
      getLimitTagsText={(more) =>
        `+${buildPlural(placeholder.replace(/s$/gi, '').toLowerCase(), more)}`}
      getOptionLabel={(option) => getItemWithoutCount(option)}
      clearIcon={<DeleteIcon />}
      renderInput={(params) => (
        <Fragment>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            {searchIcon}
            <TextField {...params} label={label} />
          </Stack>
        </Fragment>
      )}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option, inputValue);
        const parts = parse(option, matches);

        return (
          <li {...props}>
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 'bolder' : 'normal',
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
    />
  );
}
