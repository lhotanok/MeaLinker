import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import { IconButton } from '@mui/material';
import { MAX_ITEMS_FOR_FAST_AUTOCOMPLETE_RENDERING, SECONDARY_COLOR } from '../constants';
import FlexBox from './FlexBox';
import { FacetItem } from '../../recipes/types/Facets';
import { buildItemsWithCount, getItemsWithoutCount } from '../tools/value-prettifier';

type AutocompleteSearchBarProps = {
  facetItems: FacetItem[];
  label: string;
  limitTags?: number;
  onSearch: (searchedItems: string[]) => void;
  onRemove: (removedItems: string[]) => void;
};

export default function AutocompleteSearchBar({
  facetItems,
  label,
  limitTags = 6,
  onSearch,
  onRemove,
}: AutocompleteSearchBarProps) {
  const [searchedItems, setSearchedItems] = useState<string[]>([]);

  const onChangeHandler = (
    _ev: React.SyntheticEvent<Element, Event>,
    value: string[],
  ) => {
    const itemsWithoutCount = getItemsWithoutCount(value);
    setSearchedItems(itemsWithoutCount);

    if (value.length < searchedItems.length) {
      const removedItems = searchedItems.filter((item) => !value.includes(item));
      onRemove(getItemsWithoutCount(removedItems));
    } else {
      onSearch(itemsWithoutCount);
    }
  };

  const addIngredientsHandler = () => {
    setSearchedItems([]);
    onSearch(searchedItems);
  };

  return (
    <Autocomplete
      freeSolo
      multiple
      selectOnFocus
      clearOnBlur
      options={buildItemsWithCount(facetItems)}
      limitTags={limitTags}
      filterOptions={(options, state) => {
        const filteredOptions = options
          .filter((option) => {
            if (!state.inputValue) {
              return option;
            }

            return option.toLowerCase().includes(state.inputValue.toLowerCase());
          })
          .slice(0, MAX_ITEMS_FOR_FAST_AUTOCOMPLETE_RENDERING);

        return filteredOptions;
      }}
      renderInput={(params) => (
        <Stack direction='row' spacing={1.5}>
          <IconButton size='large' onClick={addIngredientsHandler}>
            <Avatar sx={{ bgcolor: SECONDARY_COLOR }}>
              <AddIcon />
            </Avatar>
          </IconButton>
          <FlexBox>
            <TextField {...params} label={label} placeholder='Ingredients' />
          </FlexBox>
        </Stack>
      )}
      onChange={onChangeHandler}
      value={searchedItems}
    />
  );
}
