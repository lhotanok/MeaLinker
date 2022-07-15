import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect, Fragment, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  SimpleRecipe,
  SimpleRecipesResponse,
} from '../../recipes/types/SimpleRecipesResponse';
import FlexBox from '../../shared/components/FlexBox';
import JsonldHelmet from '../../shared/components/JsonldHelmet';
import useHttp from '../../shared/hooks/use-http';
import { prepareRecipes } from '../../shared/tools/request-parser';
import { addThousandsSeparator, buildPlural } from '../../shared/tools/value-prettifier';
import IngredientDescription from '../components/IngredientDescription';
import IngredientHeader from '../components/IngredientHeader';
import IngredientNutrition from '../components/IngredientNutrition';
import IngredientRecipes from '../components/IngredientRecipes';
import { FullIngredient } from '../types/FullIngredient';

export default function IngredientDetail() {
  const [ingredient, setIngredient] = useState<FullIngredient>({
    jsonld: { label: {} },
    name: '',
  } as FullIngredient);

  const params = useParams();

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);

  const { isLoading, error, sendRequest } = useHttp();

  useEffect(
    () => {
      window.scrollTo(0, 0);
      const ingredientRequestConfig = {
        url: `http://localhost:5000/api/ingredients/${params.ingredientId}`,
      };

      const fetchedRecipesHandler = (recipesResponse: SimpleRecipesResponse) => {
        setTotalCount(recipesResponse.totalCount);
        setPaginatedRecipes(prepareRecipes(recipesResponse));
      };

      const fetchedIngredientHandler = (ingredient: FullIngredient) => {
        document.title = `Ingredient | ${ingredient.jsonld.label['@value']}`;
        setIngredient(ingredient);

        const recipesRequestConfig = {
          url: `http://localhost:5000/api/recipes?ingredients=${encodeURI(
            ingredient.name,
          )}`,
        };

        sendRequest(recipesRequestConfig, fetchedRecipesHandler);
      };

      sendRequest(ingredientRequestConfig, fetchedIngredientHandler);
    },
    [params.ingredientId, sendRequest],
  );

  const headerRef = useRef<HTMLDivElement>(null);

  const wikiSource = ingredient.jsonld.isPrimaryTopicOf;

  return (
    <Fragment>
      <JsonldHelmet jsonld={JSON.stringify(ingredient.jsonld)} typeLabel='ingredient' />
      <Container>
        <Container maxWidth='xl'>
          <Box pt={6}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Grid container spacing={7}>
                    <Grid item>
                      <IngredientHeader
                        isLoading={isLoading}
                        error={error}
                        ingredient={ingredient}
                      />
                    </Grid>
                    <IngredientNutrition ingredient={ingredient} />
                  </Grid>
                  <IngredientDescription
                    abstract={ingredient.jsonld.abstract}
                    comment={ingredient.jsonld.comment}
                  />
                </Stack>
              </CardContent>
              <CardActions>
                {wikiSource && (
                  <Tooltip title={wikiSource} placement='right'>
                    <Button size='small' href={wikiSource}>
                      View Source
                    </Button>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          </Box>
        </Container>
        <Container maxWidth='md'>
          <Divider variant='middle' sx={{ paddingY: 7 }} />
        </Container>
        <FlexBox>
          <Typography
            component='h1'
            variant='h5'
            color='text.secondary'
            p={4}
            ref={headerRef}
          >
            {totalCount !== null &&
              `${ingredient.jsonld.label['@value']} is part of ${buildPlural(
                'recipe',
                addThousandsSeparator(totalCount),
              )}`}
          </Typography>
        </FlexBox>
        <IngredientRecipes
          totalCount={totalCount}
          paginatedRecipes={paginatedRecipes}
          scrollHandler={() => headerRef.current && headerRef.current.scrollIntoView()}
        />
      </Container>
    </Fragment>
  );
}
