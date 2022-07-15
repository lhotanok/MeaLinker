import {
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
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
import {
  buildNutritionItems,
  parseNutritionFromIngredientJsonld,
} from '../../shared/tools/nutrition-parser';
import { prepareRecipes } from '../../shared/tools/request-parser';
import { addThousandsSeparator, buildPlural } from '../../shared/tools/value-prettifier';
import IngredientCategories from '../components/IngredientCategories';
import IngredientDescription from '../components/IngredientDescription';
import IngredientHeader from '../components/IngredientHeader';
import IngredientNutrition from '../components/IngredientNutrition';
import IngredientRecipes from '../components/IngredientRecipes';
import IngredientSource from '../components/IngredientSource';
import MadeOfCard from '../components/MadeOfCard';
import { FullIngredient } from '../types/FullIngredient';

export default function IngredientDetail() {
  const [ingredient, setIngredient] = useState<FullIngredient>({
    jsonld: { label: {} },
    structured: {},
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

  const madeOfIngredients = ingredient.structured.madeOfIngredients || [];
  const nutritionItems = buildNutritionItems(
    parseNutritionFromIngredientJsonld(ingredient),
  );

  return (
    <Fragment>
      <JsonldHelmet jsonld={JSON.stringify(ingredient.jsonld)} typeLabel='ingredient' />
      <Container>
        <Container maxWidth='xl'>
          <Box pt={6}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Grid container columnSpacing={8} rowSpacing={2}>
                    <Grid item>
                      <IngredientHeader
                        isLoading={isLoading}
                        error={error}
                        ingredient={ingredient}
                      />
                    </Grid>
                    <MadeOfCard
                      madeOfIngredients={madeOfIngredients}
                      alignment={nutritionItems.length > 0 ? 'center' : 'flex-end'}
                    />
                    <IngredientNutrition nutritionItems={nutritionItems} />
                  </Grid>
                  <IngredientDescription
                    abstract={ingredient.jsonld.abstract}
                    comment={ingredient.jsonld.comment}
                  />
                </Stack>
              </CardContent>
              <CardActions>
                <IngredientSource wikiSource={ingredient.jsonld.isPrimaryTopicOf || ''} />
              </CardActions>
            </Card>
            <Grid container mt={5}>
              <Grid item>
                <IngredientCategories
                  categories={ingredient.structured.categories || []}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Container maxWidth='md'>
          <Divider variant='middle' sx={{ paddingY: 4 }} />
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
