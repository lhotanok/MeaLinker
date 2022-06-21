import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { Card } from '@mui/material';
import HighlightedIngredientsList from './HighlightedIngredientsList';

type RecipeCardCollapseProps = {
  expanded: boolean;
  ingredients: string[];
  cardWidth: number;
};

export default function RecipeCardCollapse({
  expanded,
  ingredients,
  cardWidth,
}: RecipeCardCollapseProps) {
  return (
    <Collapse in={expanded} timeout='auto' unmountOnExit>
      <Card
        sx={{
          zIndex: 1,
          maxWidth: 400,
          width: cardWidth + 1,
          marginTop: -0.5,
          position: 'absolute',
        }}
      >
        <CardContent>
          <Typography variant='subtitle1'>
            {ingredients.length.toString() +
              ' ingredient' +
              (ingredients.length !== 1 ? 's' : '')}
          </Typography>
          <HighlightedIngredientsList ingredients={ingredients} />
        </CardContent>
      </Card>
    </Collapse>
  );
}
