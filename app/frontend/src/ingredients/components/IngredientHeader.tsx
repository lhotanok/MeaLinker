import { Typography } from '@mui/material';
import { Fragment } from 'react';
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

  return (
    <Fragment>
      {isLoading && <LinearLoadingProgress />}
      <Typography component='h1' variant='h4' color='text.primary'>
        {headlineText}
      </Typography>
      {ingredient.jsonld.country && (
        <Typography color='text.secondary'>
          Region: {ingredient.jsonld.country.replace(/^.*\//gi, '')}
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
          imageFixedHeight={220}
          buttonGroupSize='small'
          buttonGroupPb={2}
        />
      )}
    </Fragment>
  );
};

export default IngredientHeader;
