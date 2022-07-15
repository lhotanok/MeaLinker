import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SimpleIngredient } from '../types/SimpleIngredient';
import { Fragment } from 'react';

type IngredientCategoryProps = {
  name: string;
  ingredients: SimpleIngredient[];
};

export default function IngredientCategory({
  name,
  ingredients,
}: IngredientCategoryProps) {
  const ingredientChips = ingredients.map((item) => (
    <Grid item key={item.id}>
      <Chip
        label={item.name}
        component='a'
        href={`/ingredients/${item.id}`}
        clickable
        color='secondary'
      />
    </Grid>
  ));

  return (
    <Fragment>
      {ingredientChips.length > 0 && (
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
              {ingredientChips}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </Fragment>
  );
}
