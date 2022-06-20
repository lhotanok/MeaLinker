import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Measurable } from '../../../types/FullRecipe';

type NutritionListItemProps = {
  name: string;
  icon: string;
  nutritionValue?: Measurable;
};

export default function NutritionListItem({
  name,
  icon,
  nutritionValue = { value: 0, unit: '' },
}: NutritionListItemProps) {
  const { value, unit } = nutritionValue;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar variant='square' src={icon} sx={{ width: 35, height: 35 }} />
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={nutritionValue && `${value} ${unit ? `${unit}` : ''}`}
        secondaryTypographyProps={{
          width: 80,
        }}
      />
    </ListItem>
  );
}
