import { Stack, Typography } from '@mui/material';
import { escapeAHrefContent } from '../../shared/tools/value-prettifier';
import { LocalizedValue } from '../types/FullIngredient';

type IngredientDescriptionProps = {
  abstract?: LocalizedValue;
  comment?: LocalizedValue;
};
export default function IngredientDescription({
  abstract = { '@value': '', '@language': '' },
  comment = { '@value': '', '@language': '' },
}: IngredientDescriptionProps) {
  const shorterDesc =
    comment['@value'].length <= abstract['@value'].length
      ? comment['@value']
      : abstract['@value'];
  const longerDesc =
    comment['@value'].length > abstract['@value'].length
      ? comment['@value']
      : abstract['@value'];

  const shortenedLongerDesc = longerDesc.startsWith(shorterDesc)
    ? longerDesc.replace(shorterDesc, '')
    : longerDesc;

  const mergedDesc = shorterDesc.match(/[.?!]$/g)
    ? null
    : `${shorterDesc}${shortenedLongerDesc}`.replace(/ +/, ' ');

  return mergedDesc ? (
    <Typography color='text.primary'>{escapeAHrefContent(mergedDesc)}</Typography>
  ) : (
    <Stack spacing={2}>
      <Typography color='text.primary'>{escapeAHrefContent(shorterDesc)}</Typography>
      <Typography color='text.primary'>
        {escapeAHrefContent(shortenedLongerDesc)}
      </Typography>
    </Stack>
  );
}
