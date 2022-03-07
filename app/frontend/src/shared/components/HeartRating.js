import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
});

export default function HeartRating(props) {
  return (
    <Box>
      <StyledRating
        name='customized-color'
        value={props.value}
        precision={0.5}
        readOnly
        icon={<FavoriteIcon fontSize='inherit' />}
        emptyIcon={
          <FavoriteBorderIcon style={{ opacity: 0.55 }} fontSize='inherit' />
        }
      />
    </Box>
  );
}
