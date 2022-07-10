import { IconButton, Avatar, Container, Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import RemovableChips, {
  RemovableChipItem,
} from '../../../shared/components/RemovableChips';
import { PRIMARY_COLOR } from '../../../shared/constants';
import { Filters } from '../../types/Filters';
import FlexBox from '../../../shared/components/FlexBox';

type SearchedFiltersProps = {
  filters: Filters;
  onIngredientRemove: (ingrName: string) => void;
  onTagRemove: (tagName: string) => void;
  onRemoveAll: () => void;
};

export default function SearchedFilters({
  filters,
  onIngredientRemove,
  onTagRemove,
  onRemoveAll,
}: SearchedFiltersProps) {
  const { ingredients, tags, cuisines } = filters;

  const ingredientChips: RemovableChipItem[] = ingredients.map((ingr) => ({
    name: ingr,
    onRemove: onIngredientRemove,
  }));

  const otherFiltersChips: RemovableChipItem[] = [
    ...tags.map((tag) => ({
      name: tag,
      onRemove: onTagRemove,
    })),
  ];

  return (
    <Container maxWidth='md'>
      <Grid container justifyContent='center'>
        <Stack direction='row'>
          <Stack>
            {ingredientChips.length > 0 && <RemovableChips items={ingredientChips} />}
            {otherFiltersChips.length > 0 && <RemovableChips items={otherFiltersChips} />}
          </Stack>
          {ingredients.length + tags.length + cuisines.length > 0 && (
            <FlexBox>
              <IconButton
                key='remove-all-chips'
                size='large'
                onClick={() => onRemoveAll()}
              >
                <Avatar sx={{ bgcolor: PRIMARY_COLOR }}>
                  <DeleteIcon />
                </Avatar>
              </IconButton>
            </FlexBox>
          )}
        </Stack>
      </Grid>
    </Container>
  );
}
