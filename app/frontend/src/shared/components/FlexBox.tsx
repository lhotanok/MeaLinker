import { Box } from '@mui/material';

const FlexBox: React.FC<{ children: JSX.Element; alignment?: string }> = ({
  children,
  alignment = 'center',
}) => {
  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      justifyContent={alignment}
      alignItems={alignment}
    >
      {children}
    </Box>
  );
};

export default FlexBox;
