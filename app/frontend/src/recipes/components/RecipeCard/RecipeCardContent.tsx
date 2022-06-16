import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import HeartRating from '../../../shared/components/HeartRating';

type RecipeCardProps = {
  name: string;
  rating: number;
  description: string;
  mins: number;
};

export default function RecipeCardContent({
  name,
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
      <Typography variant='h5' component='div'>
        {name}
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {description}
      </Typography>
    </CardContent>
  );
}
