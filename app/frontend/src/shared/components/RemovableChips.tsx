import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import FlexBox from './FlexBox';

export type RemovableChipItem = {
  name: string;
  onRemove: (itemName: string) => void;
};

type RemovableChipsProps = {
  items: RemovableChipItem[];
  color?: 'default' | 'success' | 'info' | 'error' | 'warning' | 'primary' | 'secondary';
};

export default function RemovableChips({
  items,
  color = 'secondary',
}: RemovableChipsProps) {
  const chips = items.map((item, index) => {
    return (
      <Grid item key={index} justifyContent='center' margin={1}>
        <Chip color={color} label={item.name} onDelete={() => item.onRemove(item.name)} />
      </Grid>
    );
  });

  return (
    <FlexBox>
      <Grid container justifyContent='center'>
        <Stack direction='row'>{chips}</Stack>
      </Grid>
    </FlexBox>
  );
}
