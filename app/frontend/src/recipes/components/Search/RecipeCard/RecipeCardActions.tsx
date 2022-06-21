import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { SvgIcon, SvgIconProps, Typography } from '@mui/material';
import { buildPlural } from '../../../../shared/tools/value-prettifier';

type RecipeCardActionsProps = {
  expanded: boolean;
  stepsCount: number;
  onExpandClick: React.MouseEventHandler<HTMLButtonElement>;
  onViewClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function RecipeCardActions({
  expanded,
  stepsCount,
  onExpandClick,
  onViewClick,
}: RecipeCardActionsProps) {
  return (
    <CardActions sx={{ marginTop: 'auto' }} disableSpacing>
      <Button size='large' onClick={onViewClick}>
        View
      </Button>
      <Typography marginLeft={0.5} align='center' color='text.secondary'>
        {buildPlural('step', stepsCount)}
      </Typography>
      <Stack direction='row' marginLeft='auto'>
        <IngredientsButton
          size='medium'
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
