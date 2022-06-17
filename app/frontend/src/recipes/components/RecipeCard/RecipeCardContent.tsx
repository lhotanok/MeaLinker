import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import HeartRating from '../../../shared/components/HeartRating';
import { MAX_DESCRIPTION_CHARS } from '../../constants';
import { Box } from '@mui/material';

type RecipeCardProps = {
  name: string;
  rating: number;
  description: string;
  mins: number;
};

const buildDescriptionPreview = (description: string, name: string): string => {
  const FIRST_TWO_SENTENCES_REGEX = /[^.!?]*(\.|\?|!)([^.!?]*(\.|\?|!))?/gi;
  const descMatches = FIRST_TWO_SENTENCES_REGEX.exec(description);

  const sentences = descMatches ? descMatches[0].trim() : '';
  return sentences.length + name.length > MAX_DESCRIPTION_CHARS
    ? sentences.slice(0, MAX_DESCRIPTION_CHARS - name.length) + '...'
    : sentences;
  const descriptionPreview = description.slice(0, MAX_DESCRIPTION_CHARS);

  return descriptionPreview.length < description.length
    ? descriptionPreview + '...'
    : descriptionPreview;
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
      <Box marginTop={1.2}>
        <Typography variant='body2' color='text.secondary'>
          {buildDescriptionPreview(description, name)}
        </Typography>
      </Box>
    </CardContent>
  );
}
