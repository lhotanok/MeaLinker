import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import { IconButton } from '@mui/material';

export default function AutocompleteSearchBar(props) {
  const { hints, label, onSearch } = props;

  const [searchIngredients, setSearchIngredients] = useState([]);

  const onChangeHandler = (_ev, value) => setSearchIngredients(value);

  const searchHandler = () => {
    onSearch(searchIngredients);
    setSearchIngredients([]);
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
      value={searchIngredients}
    />
  );
}
