import { Box, Divider, Typography } from '@mui/material';
import { Fragment } from 'react';
import LinearLoadingProgress from '../../shared/components/LinearLoadingProgress';
import ZoomableImage from '../../shared/components/ZoomableImage';
import { convertFirstLetterToUppercase } from '../../shared/tools/value-prettifier';
import { FullIngredient } from '../types/FullIngredient';

const IngredientHeader: React.FC<{
  isLoading: boolean;
  error: string | null;
  ingredient: FullIngredient;
}> = ({ isLoading, error, ingredient }) => {
  const shortDescription = buildShortDescription(ingredient);
  const image = buildImageUrl(ingredient);
  const country = buildCountryName(ingredient);
  const emoji = buildEmoji(ingredient);
  const color = buildColor(ingredient);

  return (
    <Box>
      {isLoading && <LinearLoadingProgress />}
      <Typography component='h1' variant='h4' color='text.primary' gutterBottom>
        {buildHeadlineText(ingredient, isLoading, error)}
      </Typography>
      {shortDescription && (
        <Typography gutterBottom maxWidth={400}>
          {shortDescription}
          {`${emoji ? ` ${emoji}` : ''}`}
        </Typography>
      )}
      {(country || color) && <Divider sx={{ marginY: 2, mr: 6 }} />}
      {country && (
        <Typography color='text.secondary' gutterBottom>
          Place of origin: {country}
        </Typography>
      )}
      {color && (
        <Typography color='text.secondary' gutterBottom>
          Color:{` ${color}`}
        </Typography>
      )}
      {image && (
        <Box mt={3} minHeight={250} maxHeight={400} minWidth={250} maxWidth={400}>
          <ZoomableImage
            src={image}
            alt={
              ingredient.jsonld.imageCaption ? (
                ingredient.jsonld.imageCaption['@value']
              ) : (
                ingredient.name
              )
            }
            maxHeight={400}
            maxWidth={400}
            buttonGroupSize='small'
          />
        </Box>
      )}
    </Box>
  );
};

export default IngredientHeader;

const buildHeadlineText = (
  ingredient: FullIngredient,
  isLoading: boolean,
  error: string | null,
): string => {
  let headlineText =
    convertFirstLetterToUppercase(ingredient.jsonld.label['@value']) || '';

  if (error) headlineText = 'Ingredient could not be loaded';
  if (isLoading) headlineText = '';

  return headlineText;
};

const buildShortDescription = (ingredient: FullIngredient): string => {
  const { description = '' } = ingredient.jsonld;

  const prettifiedDesc = description
    ? convertFirstLetterToUppercase(description['@value'])
    : '';

  return prettifiedDesc.replace(/, (use|for)[^Q]*Q.*$/gi, '');
};

const buildImageUrl = (ingredient: FullIngredient): string => {
  const image = Array.isArray(ingredient.jsonld.image)
    ? ingredient.jsonld.image[0]
    : ingredient.jsonld.image || '';

  const thumbnail = ingredient.jsonld.thumbnail;

  return image || thumbnail || '';
};

const buildCountryName = (ingredient: FullIngredient): string => {
  const { country, countryOfOrigin } = ingredient.jsonld;
  const jsonldCountry = country || countryOfOrigin;

  const countryName =
    typeof jsonldCountry === 'object' ? jsonldCountry['@value'] : jsonldCountry || '';

  return countryName ? countryName.replace(/^.*\//gi, '').replace(/_+/g, ' ') : '';
};

const buildEmoji = (ingredient: FullIngredient): string => {
  if (ingredient.jsonld.unicodeChar) {
    const emoji = Array.isArray(ingredient.jsonld.unicodeChar)
      ? ingredient.jsonld.unicodeChar.map((char) => char['@value']).join(' ')
      : ingredient.jsonld.unicodeChar['@value'];

    return emoji;
  }

  return '';
};

const buildColor = (ingredient: FullIngredient): string => {
  const { color } = ingredient.jsonld;

  if (color) {
    const colorText = Array.isArray(color)
      ? color.map((char) => char['@value']).join(', ')
      : color['@value'];

    return colorText.replace(/[A-Z0-9]*/g, '').replace(/,[^a-z]*$/gi, '');
  }

  return '';
};
