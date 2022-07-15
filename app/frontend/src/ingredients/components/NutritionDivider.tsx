import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import { Divider, Stack, Typography } from '@mui/material';
import FlexBox from '../../shared/components/FlexBox';

export default function NutritionDivider() {
  return (
    <Divider orientation='vertical' variant='middle' textAlign='left'>
      <Stack direction='column'>
        <FlexBox>
          <MonitorWeightIcon color='secondary' />
        </FlexBox>
        <Typography pt={1} color='secondary'>
          Nutrition
        </Typography>
      </Stack>
    </Divider>
  );
}
