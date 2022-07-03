import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from '@mui/material/Container';
import { Avatar, IconButton } from '@mui/material';
import { PRIMARY_COLOR } from '../constants';
import FlexBox from './FlexBox';

type RemovableChipsProps = {
  items: string[];
  onRemove: (items: string[]) => void;
};

export default function RemovableChips({ items, onRemove }: RemovableChipsProps) {
  const listItems = items.map((item, index) => {
    return (
      <Grid item key={index} justifyContent='center' margin={1}>
        <FlexBox>
          <Chip color='secondary' label={item} onDelete={() => onRemove([item])} />
        </FlexBox>
      </Grid>
    );
  });

  if (listItems.length > 0) {
    listItems.push(
      <IconButton key='remove-all-chips' size='large' onClick={() => onRemove(items)}>
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
