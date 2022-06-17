import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import RecipeCardContent from './RecipeCardContent';
import RecipeCardCollapse from './RecipeCardCollapse';
import RecipeCardActions from './RecipeCardActions';
import { useNavigate } from 'react-router-dom';
import { SearchedRecipe } from '../../types/SearchedRecipe';
import { useEffect, useRef, useState } from 'react';

interface RecipeReviewCardProps extends SearchedRecipe {}

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
    totalMinutes,
    image,
    ingredients = [],
    searchedIngredients = [],
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
  }, []);

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
      <CardMedia component='img' height='250' image={image} alt={name} />
      <RecipeCardContent
        name={name}
        rating={rating}
        description={description}
        mins={totalMinutes}
      />
      <RecipeCardActions
        expanded={expanded}
        onExpandClick={handleExpandClick}
        onViewClick={handleViewClick}
      />
      <RecipeCardCollapse
        expanded={expanded}
        ingredients={ingredients}
        searchedIngredients={searchedIngredients}
        cardWidth={width}
      />
    </Card>
  );
}
