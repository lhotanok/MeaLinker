import { IconButton, Avatar, Grid, Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import RemovableChips, {
  RemovableChipItem,
} from '../../../../shared/components/RemovableChips';
import { PRIMARY_COLOR } from '../../../../shared/constants';
import { FilterHandler, FilterHandlers, Filters } from '../../../types/Filters';
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

  const otherFiltersChips: RemovableChipItem[] = [
    ...buildMultipleChips(tags, filterHandlers.tags),
    ...buildChipsFromSingleChip(cuisine, filterHandlers.cuisine),
    ...buildMultipleChips(mealTypes, filterHandlers.mealTypes),
    ...buildMultipleChips(diets, filterHandlers.diets),
    ...buildChipsFromSingleChip(time, filterHandlers.time),
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
      {[...ingredientChips, ...otherFiltersChips].length > 0 && (
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

const buildMultipleChips = (items: string[], filterHandler: FilterHandler) => {
  return items.map((name) => ({
    name,
    onRemove: (name: string) => filterHandler.onRemove([name]),
  }));
};

const buildChipsFromSingleChip = (item: string, filterHandler: FilterHandler) => {
  const items = item
    ? [
        {
          name: item,
          onRemove: (name: string) => filterHandler.onRemove([name]),
        },
      ]
    : [];

  return items;
};
