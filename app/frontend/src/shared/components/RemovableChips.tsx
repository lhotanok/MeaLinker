import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';

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
        <FlexBox>
          <Chip
            color={color}
            label={item.name}
            onDelete={() => item.onRemove(item.name)}
          />
        </FlexBox>
      </Grid>
    );
  });

  return (
    <Grid container justifyContent='center'>
      {chips}
    </Grid>
  );
}
