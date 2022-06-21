import { Divider, Grid } from '@mui/material';
import { Container } from '@mui/system';
import { RecipeTime } from '../../../types/FullRecipe';
import PrepTimeItem from './PrepTimeItem';

type PrepTimeBoxProps = {
  time: RecipeTime;
};

export default function PrepTimeBox({
  time = { preparation: {}, cooking: {}, total: {} },
}: PrepTimeBoxProps) {
  return (
    <Container>
      <Grid container columnSpacing={3} rowSpacing={1.5} maxWidth='75%'>
        {time.preparation && <PrepTimeItem time={time.preparation} header='Prep time' />}
        <Divider orientation='vertical' variant='middle' flexItem />
        {time.cooking && <PrepTimeItem time={time.cooking} header='Cook time' />}
        <Divider orientation='vertical' variant='middle' flexItem />
        {time.total && <PrepTimeItem time={time.total} header='Total time' />}
      </Grid>
    </Container>
  );
}
