import { CircularProgress } from '@mui/material';
import FlexBox from './FlexBox';

export default function CircularLoadingProgress() {
  return (
    <FlexBox>
      <CircularProgress color='secondary' />
    </FlexBox>
  );
}
