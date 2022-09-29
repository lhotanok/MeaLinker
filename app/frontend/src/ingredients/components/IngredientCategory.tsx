import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SimpleIngredient } from '../types/SimpleIngredient';
import IngredientChip from './IngredientChip';

type IngredientCategoryProps = {
  name: string;
  ingredients: SimpleIngredient[];
};

export default function IngredientCategory({
  name,
  ingredients,
}: IngredientCategoryProps) {
  // hotfix
  const filteredIngredients = Array.from(new Map(ingredients.map(ingredient =>
    [ingredient.name, ingredient])).values());

  return (
    <Accordion color='black'>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
        color='#000000'
      >
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          {filteredIngredients.map((item) => (
            <Grid item key={item.id}>
              <IngredientChip item={item} />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
