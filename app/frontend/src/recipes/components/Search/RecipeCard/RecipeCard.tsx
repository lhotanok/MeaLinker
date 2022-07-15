import Card from '@mui/material/Card';
import RecipeCardContent from './RecipeCardContent';
import RecipeCardCollapse from './RecipeCardCollapse';
import RecipeCardActions from './RecipeCardActions';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { SimpleRecipe } from '../../../types/SimpleRecipesResponse';
import { PAGINATION_RESULTS_COUNT } from '../../../constants';

interface RecipeCardProps extends SimpleRecipe {
  position: number;
}

export default function RecipeCard(props: RecipeCardProps) {
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
    position,
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

  const expandedCardZIndex = PAGINATION_RESULTS_COUNT - position + 10; // 10 ensures non-negative

  return (
    <Card
      ref={cardRef}
      sx={{
        maxWidth: 350,
        margin: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <RecipeCardContent
        name={name}
        rating={rating}
        reviewsCount={reviewsCount}
        description={description}
        mins={totalMinutes}
        image={image}
        onViewClick={handleViewClick}
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
        zIndex={expandedCardZIndex}
      />
    </Card>
  );
}
