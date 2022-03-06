import React from 'react';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

/**
 * Snippet from MUI documentation.
 */
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;

  return <ExpandMoreIcon {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const IngredientsButton = styled(Button)({
  paddingLeft: 15,
  paddingRight: 10,
});

export default function RecipeCardActions(props) {
  const { expanded, onExpandClick } = props;

  return (
    <CardActions disableSpacing>
      <Button size='small'>View</Button>
      <Stack direction='row' marginLeft='auto'>
        <IngredientsButton
          size='small'
          color='secondary'
          onClick={onExpandClick}
          endIcon={
            <ExpandMore
              expand={expanded}
              aria-expanded={expanded}
              aria-label='show ingredients'
            >
              <ExpandMoreIcon />
            </ExpandMore>
          }
        >
          Ingredients
        </IngredientsButton>
      </Stack>
    </CardActions>
  );
}
