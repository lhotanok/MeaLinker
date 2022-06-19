import { CircularProgress } from '@mui/material';
import CenteredBox from './CenteredBox';

export default function CircularLoadingProgress() {
  return <CenteredBox children={<CircularProgress color='secondary' />} />;
}
