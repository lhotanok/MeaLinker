import { Box, Divider, Stack, Typography } from '@mui/material';
import AvTimerOutlinedIcon from '@mui/icons-material/AvTimerOutlined';

import { PrepTime } from '../../../types/FullRecipe';
import { joinTimeEntries } from '../../../../shared/tools/value-prettifier';

type PrepTimeDividerProps = {
  totalTime?: PrepTime;
};

export default function PrepTimeDivider({ totalTime }: PrepTimeDividerProps) {
  return (
    <Box pt={2} pb={2.5}>
      <Divider variant='middle' textAlign='right'>
        <Stack direction='row' spacing={1}>
          <AvTimerOutlinedIcon color='secondary' />
          {totalTime && (
            <Typography pt={1} color='text.secondary'>
              ready in {joinTimeEntries(totalTime)}
            </Typography>
          )}
        </Stack>
      </Divider>
    </Box>
  );
}
