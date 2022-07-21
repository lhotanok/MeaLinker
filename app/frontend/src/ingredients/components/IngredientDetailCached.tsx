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
import { useLocation, useParams } from 'react-router-dom';
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
import {
  buildIngredientSearchUrl,
  buildRecipesSearchUrl,
  prepareRecipes,
} from '../../shared/tools/request-parser';
import {
  addThousandsSeparator,
  buildPlural,
  convertFirstLetterToUppercase,
} from '../../shared/tools/value-prettifier';
import IngredientCategories from './IngredientCategories';
import IngredientDescription from './IngredientDescription';
import IngredientHeader from './IngredientHeader';
import IngredientNutrition from './IngredientNutrition';
import IngredientRecipes from './IngredientRecipes';
import IngredientSource from './IngredientSource';
import MadeOfCard from './MadeOfCard';
import { FullIngredient } from '../types/FullIngredient';

export default function IngredientDetailPage() {
  const [ingredient, setIngredient] = useState<FullIngredient>({
    jsonld: { label: {} },
    structured: {},
    name: '',
  } as FullIngredient);

  const params = useParams();
  const { search } = useLocation();

  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [paginatedRecipes, setPaginatedRecipes] = useState<SimpleRecipe[]>([]);

  const { isLoading, error, sendRequest } = useHttp();

  useEffect(
    () => {
      const fetchedRecipesHandler = (recipesResponse: SimpleRecipesResponse) => {
        setTotalCount(recipesResponse.totalCount);
        setPaginatedRecipes(prepareRecipes(recipesResponse));
      };

      const fetchedIngredientHandler = (fetchedIngredient: FullIngredient) => {
        document.title = `Ingredient | ${fetchedIngredient.jsonld.label['@value']}`;
        setIngredient(fetchedIngredient);

        const searchParams = new URLSearchParams(decodeURI(search));
        searchParams.set('ingredients', encodeURI(fetchedIngredient.name));

        const page = searchParams.get('page') || '1';
        if (page === '1') {
          window.scrollTo(0, 0);
        }

        const recipesRequestConfig = {
          url: buildRecipesSearchUrl(searchParams),
        };

        sendRequest(recipesRequestConfig, fetchedRecipesHandler);
      };

      if (params.ingredientId) {
        const ingredientRequestConfig = {
          url: buildIngredientSearchUrl(params.ingredientId),
        };
        sendRequest(ingredientRequestConfig, fetchedIngredientHandler);
      }
    },
    [params.ingredientId, sendRequest, search],
  );

  const headerRef = useRef<HTMLDivElement>(null);

  const madeOfIngredients = ingredient.structured.madeOfIngredients || [];
  const nutritionItems = buildNutritionItems(
    parseNutritionFromIngredientJsonld(ingredient),
  );

  const label = convertFirstLetterToUppercase(ingredient.jsonld.label['@value']);

  return (
    <Container>
      <JsonldHelmet jsonld={JSON.stringify(ingredient.jsonld)} typeLabel='ingredient' />
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
                ingredientName={label}
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
        <Fragment>
          {totalCount !== null &&
          totalCount !== 0 && (
            <Typography
              component='h1'
              variant='h5'
              color='text.secondary'
              p={4}
              ref={headerRef}
            >
              {`${label} is part of ${buildPlural(
                'recipe',
                addThousandsSeparator(totalCount),
              )}`}
            </Typography>
          )}
        </Fragment>
      </FlexBox>
      <IngredientRecipes
        totalCount={totalCount}
        paginatedRecipes={paginatedRecipes}
        scrollHandler={() => headerRef.current && headerRef.current.scrollIntoView()}
      />
    </Container>
  );
}
