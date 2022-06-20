import { List } from '@mui/material';
import { Measurable } from '../../../types/FullRecipe';
import NutritionListItem from './NutritionListItem';

type NutritionListProps = {
  nutritionItems: NutritionItem[];
};

export type NutritionItem = {
  name: string;
  icon: string;
  value: Measurable;
};

export default function NutritionList({ nutritionItems }: NutritionListProps) {
  const nutritionListItems = nutritionItems.map(({ name, icon, value }) => {
    return <NutritionListItem name={name} icon={icon} nutritionValue={value} />;
  });

  return <List>{nutritionListItems}</List>;
}
