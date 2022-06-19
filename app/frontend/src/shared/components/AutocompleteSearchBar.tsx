import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import { IconButton } from '@mui/material';
import { SECONDARY_COLOR } from '../constants';
import CenteredBox from './CenteredBox';

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

  const onChangeHandler = (_ev: React.SyntheticEvent<Element, Event>, value: string[]) =>
    setSearchedItems(value);

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
            <Avatar sx={{ bgcolor: SECONDARY_COLOR }}>
              <AddIcon />
            </Avatar>
          </IconButton>
          <CenteredBox children={<TextField {...params} label={label} />} />
        </Stack>
      )}
      onChange={onChangeHandler}
      value={searchedItems}
    />
  );
}
