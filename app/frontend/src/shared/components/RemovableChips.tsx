import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { ListBaseItem } from '../types/ListBaseItem';

type RemovableChipsProps = {
  chips: ListBaseItem[];
  onRemove: (event: any) => void;
};

export default function RemovableChips(props: RemovableChipsProps) {
  const { chips, onRemove } = props;
  console.log(`Chips: ${JSON.stringify(chips)}`);

  const handleRemove = (chipToRemove: ListBaseItem) => () => {
    onRemove(chipToRemove);
  };

  const listItems = chips.map((data) => {
    return (
      <Grid item key={data.key}>
        <Chip
          color='secondary'
          label={data.label}
          onDelete={handleRemove(data)}
        />
      </Grid>
    );
  });

  return (
    <Container maxWidth='md'>
      <Grid container spacing={1.5} justifyContent='center'>
        {listItems}
      </Grid>
    </Container>
  );
}
