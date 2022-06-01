import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import {
  IconButton,
  IconButtonProps,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';

type RecipeCardActionsProps = {
  expanded: boolean;
  onExpandClick: React.MouseEventHandler<HTMLButtonElement>;
  onViewClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function RecipeCardActions({
  expanded,
  onExpandClick,
  onViewClick,
}: RecipeCardActionsProps) {
  return (
    <CardActions disableSpacing>
      <Button size='small' onClick={onViewClick}>
        View
      </Button>
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

interface ExpandMoreProps extends SvgIconProps {
  expand: boolean;
}

/**
 * Snippet from MUI documentation: https://mui.com/material-ui/react-card/.
 */
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;

  return <SvgIcon {...other} />;
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
