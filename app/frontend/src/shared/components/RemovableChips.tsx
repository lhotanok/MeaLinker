import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from '@mui/material/Container';
import { ListBaseItem } from '../types/ListBaseItem';
import { Avatar, IconButton } from '@mui/material';
import { PRIMARY_COLOR } from '../constants';
import CenteredBox from './CenteredBox';

type RemovableChipsProps = {
  chips: ListBaseItem[];
  onRemove: (event: any) => void;
  onRemoveAll: () => void;
};

export default function RemovableChips(props: RemovableChipsProps) {
  const { chips, onRemove, onRemoveAll } = props;

  const handleRemove = (chipToRemove: ListBaseItem) => () => {
    onRemove(chipToRemove);
  };

  const listItems = chips.map((data) => {
    return (
      <Grid item key={data.key} justifyContent='center' margin={1}>
        <CenteredBox
          children={
            <Chip color='secondary' label={data.label} onDelete={handleRemove(data)} />
          }
        />
      </Grid>
    );
  });

  if (listItems.length > 0) {
    listItems.push(
      <IconButton key='remove-all-chips' size='large' onClick={onRemoveAll}>
        <Avatar sx={{ bgcolor: PRIMARY_COLOR }}>
          <DeleteIcon />
        </Avatar>
      </IconButton>,
    );
  }

  return (
    <Container maxWidth='md'>
      <Grid container justifyContent='center'>
        {listItems}
      </Grid>
    </Container>
  );
}
