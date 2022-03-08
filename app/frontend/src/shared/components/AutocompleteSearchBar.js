import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import { IconButton } from '@mui/material';

export default function AutocompleteSearchBar(props) {
  const { hints, label } = props;

  return (
    <Autocomplete
      freeSolo
      multiple
      selectOnFocus
      clearOnBlur
      options={hints}
      renderInput={(params) => (
        <Stack direction='row' spacing={1.5}>
          <IconButton size='large'>
            <Avatar sx={{ bgcolor: '#548664' }}>
              <SearchIcon />
            </Avatar>
          </IconButton>
          <TextField {...params} label={label} />
        </Stack>
      )}
    />
  );
}
