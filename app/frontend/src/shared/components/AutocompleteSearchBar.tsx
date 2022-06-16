import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import { IconButton } from '@mui/material';

type AutocompleteSearchBarProps = {
  hints: string[];
  label: string;
  onSearch: (searchedItems: string[]) => void;
};

export default function AutocompleteSearchBar({
  hints,
  label,
  onSearch,
}: AutocompleteSearchBarProps) {
  const [searchedItems, setSearchedItems] = useState<string[]>([]);

  const onChangeHandler = (
    _ev: React.SyntheticEvent<Element, Event>,
    value: string[],
  ) => setSearchedItems(value);

  const searchHandler = () => {
    onSearch(searchedItems);
    setSearchedItems([]);
  };

  return (
    <Autocomplete
      freeSolo
      multiple
      selectOnFocus
      clearOnBlur
      options={hints}
      renderInput={(params) => (
        <Stack direction='row' spacing={1.5}>
          <IconButton size='large' onClick={searchHandler}>
            <Avatar sx={{ bgcolor: '#548664' }}>
              <SearchIcon />
            </Avatar>
          </IconButton>
          <TextField {...params} label={label} />
        </Stack>
      )}
      onChange={onChangeHandler}
      value={searchedItems}
    />
  );
}
