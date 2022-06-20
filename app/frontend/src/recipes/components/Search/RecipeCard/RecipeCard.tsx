import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import RecipeCardContent from './RecipeCardContent';
import RecipeCardCollapse from './RecipeCardCollapse';
import RecipeCardActions from './RecipeCardActions';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { SimpleRecipe } from '../../../types/SimpleRecipesResponse';
import { CardActionArea } from '@mui/material';

interface RecipeReviewCardProps extends SimpleRecipe {}

export default function RecipeReviewCard(props: RecipeReviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  const {
    id,
    name,
    description = '',
    rating,
    reviewsCount = 0,
    stepsCount,
    totalMinutes,
    image,
    ingredients = [],
  } = props;

  const handleExpandClick = () => {
    setExpanded(!expanded);

    if (cardRef && cardRef.current) {
      setWidth(cardRef.current.offsetWidth);
    }
  };

  const handleViewClick = () => {
    navigate(`/recipes/${id}`);
  };

  useEffect(() => {
    const handleResize = () => {
      if (cardRef && cardRef.current) {
        setWidth(cardRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
  });

  return (
    <Card
      ref={cardRef}
      sx={{
        maxWidth: 400,
        margin: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardActionArea onClick={handleViewClick}>
        <CardMedia component='img' height='250' image={image} alt={name} />
      </CardActionArea>

      <RecipeCardContent
        name={name}
        rating={rating}
        reviewsCount={reviewsCount}
        description={description}
        mins={totalMinutes}
      />
      <RecipeCardActions
        expanded={expanded}
        stepsCount={stepsCount}
        onExpandClick={handleExpandClick}
        onViewClick={handleViewClick}
      />
      <RecipeCardCollapse
        expanded={expanded}
        ingredients={ingredients}
        cardWidth={width}
      />
    </Card>
  );
}
