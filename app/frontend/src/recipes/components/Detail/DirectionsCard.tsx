import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import directionsIcon from '../../../assets/directions-icon.png';
import InfoCard from '../../../shared/components/InfoCard';
import { SECONDARY_COLOR } from '../../../shared/constants';

type DirectionsCardProps = {
  directions: string[];
};

export default function DirectionsCard({ directions }: DirectionsCardProps) {
  const directionListItems = directions.map((direction, index) => {
    return (
      <ListItem key={index}>
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: SECONDARY_COLOR,
              width: 30,
              height: 30,
            }}
          >
            {index + 1}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={direction} />
      </ListItem>
    );
  });

  return (
    <Box pt={5}>
      <InfoCard
        title='Directions'
        iconSrc={directionsIcon}
        content={<List>{directionListItems}</List>}
      />
    </Box>
  );
}
