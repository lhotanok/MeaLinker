import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { MAX_ITEMS_FOR_FAST_AUTOCOMPLETE_RENDERING } from '../constants';
import { FacetItem } from '../../recipes/types/Facets';
import { buildItemsWithCount, getItemsWithoutCount } from '../tools/value-prettifier';

type AutocompleteSearchBarProps = {
  facetItems: FacetItem[];
  searchedItems: string[];
  label: string;
  placeholder?: string;
  limitTags?: number;
  onSearch: (searchedItems: string[]) => void;
  onRemove: (removedItems: string[]) => void;
};

export default function AutocompleteSearchBar({
  searchedItems,
  facetItems,
  label,
  placeholder,
  limitTags = 5,
  onSearch,
  onRemove,
}: AutocompleteSearchBarProps) {
  const onChangeHandler = (
    _ev: React.SyntheticEvent<Element, Event>,
    value: string[],
  ) => {
    const itemsWithoutCount = getItemsWithoutCount(value);
    onSearch(itemsWithoutCount);

    if (value.length < searchedItems.length) {
      const removedItems = searchedItems.filter((item) => !value.includes(item));
      onRemove(getItemsWithoutCount(removedItems));
    } else {
      onSearch(itemsWithoutCount);
    }
  };

  return (
    <Autocomplete
      freeSolo
      multiple
      selectOnFocus
      clearOnBlur
      clearOnEscape
      options={buildItemsWithCount(facetItems)}
      limitTags={limitTags}
      onChange={onChangeHandler}
      value={searchedItems}
      filterOptions={createFilterOptions({
        limit: MAX_ITEMS_FOR_FAST_AUTOCOMPLETE_RENDERING,
      })}
      clearIcon={<DeleteIcon />}
      renderInput={(params) => (
        <Stack direction='row' spacing={1.5} alignItems='center'>
          <SearchIcon fontSize='large' color='secondary' />
          <TextField {...params} label={label} placeholder={placeholder} />
        </Stack>
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
