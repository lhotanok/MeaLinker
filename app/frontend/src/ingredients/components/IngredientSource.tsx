import { Tooltip, Button } from '@mui/material';
import { Fragment } from 'react';

type IngredientSource = {
  wikiSource: string;
};

export default function IngredientSource({ wikiSource }: IngredientSource) {
  return (
    <Fragment>
      {wikiSource && (
        <Tooltip title={wikiSource} placement='right'>
          <Button size='small' href={wikiSource}>
            View Source
          </Button>
        </Tooltip>
      )}
    </Fragment>
  );
}
