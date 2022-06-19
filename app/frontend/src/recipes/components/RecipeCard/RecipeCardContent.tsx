import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import HeartRating from '../../../shared/components/HeartRating';
import { ALL_SENTENCES_REGEX, MAX_DESCRIPTION_CHARS } from '../../constants';
import { Box } from '@mui/material';
import humanizeDuration from 'humanize-duration';

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
          <Typography
            textAlign='right'
            marginLeft='auto'
            color='#00cb0f'
          >{`${buildHumanReadablePrepTime(mins)}`}</Typography>
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

const buildHumanReadablePrepTime = (minutes: number): string => {
  const milliseconds = minutes * 60 * 1000;

  // Snippet from: https://www.npmjs.com/package/humanize-duration
  const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: 'shortEn',
    languages: {
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'min',
        s: () => 's',
        ms: () => 'ms',
      },
    },
  });

  return shortEnglishHumanizer(milliseconds);
};
