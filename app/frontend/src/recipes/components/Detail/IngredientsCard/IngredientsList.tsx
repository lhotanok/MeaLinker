import {
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  List,
  ListItemAvatar,
  Box,
  Link,
  Tooltip,
  Stack,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import { PRIMARY_COLOR } from '../../../../shared/constants';
import { shiftNonAmountIngredientsToBack } from '../../../../shared/tools/value-prettifier';
import { RecipeIngredient } from '../../../types/FullRecipe';
import { SimpleIngredient } from '../../../types/SimpleIngredient';

type IngredientsListProps = {
  ingredients: RecipeIngredient[];
  detailIngredients: SimpleIngredient[];
};
export default function IngredientsList({
  ingredients,
  detailIngredients,
}: IngredientsListProps) {
  const sortedIngredients = shiftNonAmountIngredientsToBack(ingredients);

  const navigate = useNavigate();

  const handleViewClick = (ingredientId: string) => {
    navigate(`/ingredients/${ingredientId}`);
  };

  const ingredientItems = sortedIngredients.map((ingredient, index) => {
    const { identifier, text, amount, label = { '@value': '' }, thumbnail } = ingredient;

    const lowercaseLabel = label['@value'].toLowerCase();

    const highlightedText = lowercaseLabel
      ? reactStringReplace(text, lowercaseLabel, (match, index) => {
          if (index === 1) {
            return (
              <Tooltip
                title={
                  <Stack>
                    See more
                    {thumbnail && (
                      <Avatar
                        onClick={() => handleViewClick(identifier)}
                        src={thumbnail}
                      />
                    )}
                  </Stack>
                }
              >
                <Link
                  key={index}
                  color={PRIMARY_COLOR}
                  onClick={() => handleViewClick(identifier)}
                >
                  {match}
                </Link>
              </Tooltip>
            );
          } else {
            return match;
          }
        })
      : text;

    const formattedAmount = (
      <Stack direction='row' spacing={0.5}>
        {amount.split(' ').map((amountFragment, index) => (
          <Typography fontSize={index === 0 ? 'medium' : 'small'} color='primary'>
            {amountFragment}
          </Typography>
        ))}
      </Stack>
    );

    return (
      <Fragment key={index}>
        <ListItem>
          <ListItemAvatar>
            {amount && (
              <Box display='flex' justifyContent='center' alignItems='center' height={6}>
                {formattedAmount}
              </Box>
            )}
          </ListItemAvatar>
          <ListItemText primary={highlightedText} sx={{ paddingLeft: 1 }} />
        </ListItem>
        {index !== ingredients.length - 1 && <Divider component='li' variant='inset' />}
      </Fragment>
    );
  });

  return <List>{ingredientItems}</List>;
}
