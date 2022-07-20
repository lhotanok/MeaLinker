import { Grid, Card, CardHeader, CardContent, Chip } from '@mui/material';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import FlexBox from '../../shared/components/FlexBox';
import { SimpleIngredient } from '../types/SimpleIngredient';

type MadeOfCardProps = {
  madeOfIngredients: SimpleIngredient[];
  alignment: string;
};

export default function MadeOfCard({ madeOfIngredients, alignment }: MadeOfCardProps) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {madeOfIngredients.length > 0 && (
        <Grid item>
          <FlexBox alignment={alignment}>
            <Card>
              <CardHeader title='Made of' />
              <CardContent>
                <Grid container spacing={1}>
                  {madeOfIngredients.map(({ name, id }) => (
                    <Grid item key={id}>
                      <Chip
                        label={name}
                        component='a'
                        clickable
                        color='secondary'
                        onClick={() => navigate(`/ingredients/${id}`)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </FlexBox>
        </Grid>
      )}
    </Fragment>
  );
}
