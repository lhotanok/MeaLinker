import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Measurable } from '../../../types/FullRecipe';

type NutritionItemProps = {
  name: string;
  icon: string;
  nutritionValue?: Measurable;
};

export default function NutritionItem({
  name,
  icon,
  nutritionValue = { value: 0, unit: '' },
}: NutritionItemProps) {
  const { value, unit } = nutritionValue;

  return (
    <ListItem component='div'>
      <ListItemAvatar>
        <Avatar variant='rounded' src={icon} sx={{ width: 36, height: 36 }} />
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
