import { Box } from '@mui/material';
import { ReactNode } from 'react';

type TabPanelProps = {
  children?: ReactNode;
  index: number;
  value: number;
};

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3, paddingX: 6 }}>{children}</Box>}
    </Box>
  );
}
