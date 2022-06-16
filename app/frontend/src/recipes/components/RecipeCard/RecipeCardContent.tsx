import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import HeartRating from '../../../shared/components/HeartRating';

type RecipeCardProps = {
  rating: number;
  description: string;
  mins: number;
};

export default function RecipeCardContent({
  rating,
  description,
  mins,
}: RecipeCardProps) {
  return (
    <CardContent>
      <Stack direction='row'>
        <HeartRating value={rating} />
        {mins && (
          <Typography
            textAlign='right'
            marginLeft='auto'
            color='#00cb0f'
          >{`${mins} mins`}</Typography>
        )}
      </Stack>
      <Typography variant='body2' color='text.secondary'>
        {description}
      </Typography>
    </CardContent>
  );
}
