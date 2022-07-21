import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { LIGHTER_SECONDARY_COLOR } from '../../../shared/constants';

type DirectionItemProps = {
  direction: string;
  position: number;
};

export default function DirectionItem({ direction, position }: DirectionItemProps) {
  return (
    <ListItem key={position}>
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: LIGHTER_SECONDARY_COLOR,
            width: 30,
            height: 30,
          }}
        >
          {position + 1}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={direction} />
    </ListItem>
  );
}
