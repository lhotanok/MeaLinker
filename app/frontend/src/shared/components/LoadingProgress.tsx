import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

export default function LoadingProgress() {
  return (
    <Box sx={{ width: '95%', margin: 'auto' }}>
      <LinearProgress color='secondary' />
    </Box>
  );
}
