import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { LIGHTER_PRIMARY_COLOR } from '../constants';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: LIGHTER_PRIMARY_COLOR,
  },
});

type HeartRatingProps = {
  value: number;
};

export default function HeartRating({ value }: HeartRatingProps) {
  return (
    <Box>
      <StyledRating
        name='customized-color'
        value={value}
        precision={0.5}
        readOnly
        icon={<FavoriteIcon fontSize='inherit' />}
        emptyIcon={<FavoriteBorderIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
      />
    </Box>
  );
}
