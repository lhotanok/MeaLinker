import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { joinTimeEntries } from '../../../../shared/tools/value-prettifier';
import { PrepTime } from '../../../types/FullRecipe';

type PrepTimeItemProps = {
  time: PrepTime;
  header: string;
};

export default function PrepTimeItem({ time, header }: PrepTimeItemProps) {
  const preferMinutesFormat = true;

  return (
    <Grid item xs>
      <Box>
        <Typography color='text.primary'>{header}</Typography>
        <Typography color='secondary'>
          {joinTimeEntries(time, preferMinutesFormat)}
        </Typography>
      </Box>
    </Grid>
  );
}
