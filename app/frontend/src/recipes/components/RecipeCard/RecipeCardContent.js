import React from 'react';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import HeartRating from '../../../shared/HeartRating';

export default function RecipeCardContent(props) {
  return (
    <CardContent>
      <HeartRating value={props.rating} />
      <Typography variant='body2' color='text.secondary'>
        {props.description}
      </Typography>
    </CardContent>
  );
}
