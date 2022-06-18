import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import HeartRating from '../../../shared/components/HeartRating';
import { ALL_SENTENCES_REGEX, MAX_DESCRIPTION_CHARS } from '../../constants';
import { Box } from '@mui/material';

type RecipeCardProps = {
  name: string;
  rating: number;
  description: string;
  mins: number;
};

const buildDescriptionPreview = (description: string, name: string): string => {
  const sentencesMatches = Array.from(description.matchAll(ALL_SENTENCES_REGEX));

  const sentences: string[] = [];

  let characters = name.length;

  for (const sentenceMatch of sentencesMatches) {
    const sentence = sentenceMatch[0];

    // MAX_DESCRIPTION_CHARS limit doesn't need to be met strictly
    if (characters + sentence.length > MAX_DESCRIPTION_CHARS) {
      break;
    }

    characters += sentence.length;
    sentences.push(sentence);
  }

  return sentences.join('');
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
