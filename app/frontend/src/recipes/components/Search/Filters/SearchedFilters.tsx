import { IconButton, Avatar, Grid, Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import RemovableChips, {
  RemovableChipItem,
} from '../../../../shared/components/RemovableChips';
import { PRIMARY_COLOR } from '../../../../shared/constants';
import { FilterHandlers, Filters } from '../../../types/Filters';
import FlexBox from '../../../../shared/components/FlexBox';

type SearchedFiltersProps = {
  filters: Filters;
  filterHandlers: FilterHandlers;
  onRemoveAll: () => void;
};

export default function SearchedFilters({
  filters,
  filterHandlers,
  onRemoveAll,
}: SearchedFiltersProps) {
  const { ingredients, tags, cuisine, diets, mealTypes, time } = filters;

  const ingredientChips: RemovableChipItem[] = ingredients.map((ingr) => ({
    name: ingr,
    onRemove: (name) => filterHandlers.ingredients.onRemove([name]),
  }));

  const cuisines = cuisine
    ? [
        {
          name: cuisine,
          onRemove: (name: string) => filterHandlers.cuisine.onRemove([name]),
        },
      ]
    : [];

  const otherFiltersChips: RemovableChipItem[] = [
    ...tags.map((name) => ({
      name,
      onRemove: (name: string) => filterHandlers.tags.onRemove([name]),
    })),
    ...cuisines,
    ...mealTypes.map((name) => ({
      name,
      onRemove: (name: string) => filterHandlers.mealTypes.onRemove([name]),
    })),
    ...diets.map((name) => ({
      name,
      onRemove: (name: string) => filterHandlers.diets.onRemove([name]),
    })),
    ...time.map((name) => ({
      name,
      onRemove: (name: string) => filterHandlers.time.onRemove([name]),
    })),
  ];

  return (
    <Grid container justifyContent='center'>
      <Grid item maxWidth='87%'>
        <FlexBox>
          <Stack>
            {ingredientChips.length > 0 && <RemovableChips items={ingredientChips} />}
            {otherFiltersChips.length > 0 && (
              <RemovableChips items={otherFiltersChips} color='default' />
            )}
          </Stack>
        </FlexBox>
      </Grid>
      {ingredients.length + tags.length + cuisines.length > 0 && (
        <Grid item>
          <FlexBox>
            <IconButton key='remove-all-chips' size='large' onClick={() => onRemoveAll()}>
              <Tooltip title='Clear all filters' placement='right-end' enterDelay={500}>
                <Avatar sx={{ bgcolor: PRIMARY_COLOR }}>
                  <DeleteIcon />
                </Avatar>
              </Tooltip>
            </IconButton>
          </FlexBox>
        </Grid>
      )}
    </Grid>
  );
}
