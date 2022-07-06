import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { Box, CardActionArea, CardMedia } from '@mui/material';
import {
  buildDescriptionPreview,
  convertToReadableTime,
  escapeAHrefContent,
} from '../../../../shared/tools/value-prettifier';
import HeartRating from '../../../../shared/components/HeartRating';
import { Fragment } from 'react';

type RecipeCardProps = {
  name: string;
  rating: number;
  reviewsCount: number;
  description: string;
  mins: number;
  image: string;
  onViewClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function RecipeCardContent({
  name,
  rating,
  reviewsCount,
  description,
  mins,
  image,
  onViewClick,
}: RecipeCardProps) {
  const descriptionPreview = buildDescriptionPreview(description, name);
  const escapedDescription = escapeAHrefContent(descriptionPreview);

  return (
    <Fragment>
      <CardActionArea onClick={onViewClick}>
        <CardMedia component='img' height='250' image={image} alt={name} />
      </CardActionArea>
      <CardContent>
        <Stack direction='row'>
          <HeartRating value={rating} />
          <Typography marginLeft='2%'>{`(${reviewsCount || 0})`}</Typography>
          {mins && (
            <Typography textAlign='right' marginLeft='auto' color='#00cb0f'>
              {convertToReadableTime(mins)}
            </Typography>
          )}
        </Stack>
        <Typography variant='h5' component='div'>
          {name}
        </Typography>
        <Box marginTop={1.2}>
          <Typography variant='body2' color='text.secondary'>
            {escapedDescription}
          </Typography>
        </Box>
      </CardContent>
    </Fragment>
  );
}
