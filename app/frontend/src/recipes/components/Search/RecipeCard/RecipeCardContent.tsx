import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import {
  buildDescriptionPreview,
  convertToReadableTime,
} from '../../../../shared/tools/value-prettifier';
import HeartRating from '../../../../shared/components/HeartRating';

type RecipeCardProps = {
  name: string;
  rating: number;
  reviewsCount: number;
  description: string;
  mins: number;
};

export default function RecipeCardContent({
  name,
  rating,
  reviewsCount,
  description,
  mins,
}: RecipeCardProps) {
  return (
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
          {buildDescriptionPreview(description, name)}
        </Typography>
      </Box>
    </CardContent>
  );
}
