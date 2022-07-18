import { Box, Typography } from '@mui/material';
import LinearLoadingProgress from '../../shared/components/LinearLoadingProgress';
import ZoomableImage from '../../shared/components/ZoomableImage';
import { FullIngredient } from '../types/FullIngredient';

const IngredientHeader: React.FC<{
  isLoading: boolean;
  error: string | null;
  ingredient: FullIngredient;
}> = ({ isLoading, error, ingredient }) => {
  let headlineText = ingredient.jsonld.label['@value'] || '';
  if (error) headlineText = 'Ingredient could not be loaded';
  if (isLoading) headlineText = '';

  const jsonldCountry = ingredient.jsonld.country || '';
  const country =
    typeof jsonldCountry === 'object' ? jsonldCountry['@value'] : jsonldCountry;

  return (
    <Box>
      {isLoading && <LinearLoadingProgress />}
      <Typography component='h1' variant='h4' color='text.primary' gutterBottom>
        {headlineText}
      </Typography>
      {country && (
        <Typography color='text.secondary' gutterBottom>
          Place of origin: {country.replace(/^.*\//gi, '').replace(/_+/g, ' ')}
        </Typography>
      )}
      {ingredient.jsonld.thumbnail && (
        <ZoomableImage
          src={ingredient.jsonld.thumbnail}
          alt={
            ingredient.jsonld.imageCaption ? (
              ingredient.jsonld.imageCaption['@value']
            ) : (
              ingredient.name
            )
          }
          maxHeight={450}
          buttonGroupSize='small'
          buttonGroupPb={1}
        />
      )}
    </Box>
  );
};

export default IngredientHeader;
