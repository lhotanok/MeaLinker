import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeartRating from '../../shared/HeartRating';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;

  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const {
    title,
    description,
    rating,
    date,
    image,
    ingredients,
    searchedIngredients,
  } = props;

  const ingredientElements = ingredients.map((ingredient) => {
    let emphasize = false;
    searchedIngredients.forEach((searched) => {
      if (ingredient.toLocaleLowerCase().includes(searched)) {
        emphasize = true;
      }
    });

    const ingredientItem = <li>{ingredient}</li>;

    return emphasize ? <strong>{ingredientItem}</strong> : ingredientItem;
  });

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader title={title} subheader={date} />
      <CardMedia component='img' height='194' image={image} alt={title} />
      <CardContent>
        <HeartRating value={rating} />
        <Typography variant='body2' color='text.secondary'>
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button size='small'>View</Button>
        <Stack direction='row' marginLeft='auto'>
          <Button size='small' onClick={handleExpandClick} color='secondary'>
            Ingredients<ExpandMore
              expand={expanded}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Button>
        </Stack>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography variant='h6'>Ingredients</Typography>
          <Typography variant='body2' color='text.secondary'>
            <ul>
              {ingredientElements.map((ingredient) => <li>{ingredient}</li>)}
            </ul>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
