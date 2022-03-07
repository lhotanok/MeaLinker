import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import RecipeCardContent from './RecipeCardContent';
import RecipeCardCollapse from './RecipeCardCollapse';
import RecipeCardActions from './RecipeCardActions';

export default function RecipeReviewCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const {
    id,
    title,
    description,
    rating,
    totalMins,
    date,
    image,
    ingredients,
    searchedIngredients,
  } = props;

  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardHeader title={title} subheader={date} />
      <CardMedia component='img' height='194' image={image} alt={title} />
      <RecipeCardContent
        rating={rating}
        description={description}
        mins={totalMins}
      />
      <RecipeCardActions
        expanded={expanded}
        onExpandClick={handleExpandClick}
      />
      <RecipeCardCollapse
        expanded={expanded}
        ingredients={ingredients}
        searchedIngredients={searchedIngredients}
      />
    </Card>
  );
}
