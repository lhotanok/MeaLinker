import { ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import { Measurable } from '../../recipes/types/FullRecipe';

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
      <Box mb='auto' mt={1}>
        <ListItemAvatar>
          <Avatar variant='rounded' src={icon} sx={{ width: 36, height: 36 }} />
        </ListItemAvatar>
      </Box>
      <ListItemText
        primary={name}
        secondary={nutritionValue && `${value || 0} ${unit ? `${unit}` : ''}`}
        secondaryTypographyProps={{
          width: 80,
        }}
      />
    </ListItem>
  );
}
