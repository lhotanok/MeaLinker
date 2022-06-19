import { Box } from '@mui/material';

const CenteredBox: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
