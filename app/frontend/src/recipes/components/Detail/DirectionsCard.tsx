import { Box, Divider, List } from '@mui/material';
import { Fragment } from 'react';
import directionsIcon from '../../../assets/directions-icon.png';
import InfoCard from '../../../shared/components/InfoCard';
import { RecipeInstruction } from '../../types/RecipeJsonld';
import DirectionItem from './DirectionItem';

type DirectionsCardProps = {
  directions: RecipeInstruction[];
};

export default function DirectionsCard({ directions }: DirectionsCardProps) {
  const directionListItems = directions.map((direction, index) => {
    if (direction.itemListElement) {
      if (direction.name) {
        return (
          <Fragment>
            <Divider variant='middle'>{direction.name.replace(/:$/, '')}</Divider>
            <List>
              {direction.itemListElement.map((item, i) => (
                <DirectionItem key={direction.name} direction={item.text} position={i} />
              ))}
            </List>
          </Fragment>
        );
      }
    }

    return (
      <DirectionItem key={index} direction={direction.text || ''} position={index} />
    );
  });

  return (
    <Box pt={5}>
      <InfoCard
        title='Directions'
        iconSrc={directionsIcon}
        content={<List>{directionListItems}</List>}
      />
    </Box>
  );
}
