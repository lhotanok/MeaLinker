import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
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
import { prepareRecipes } from '../../shared/tools/request-parser';
import {
  addThousandsSeparator,
  buildPlural,
  escapeAHrefContent,
} from '../../shared/tools/value-prettifier';
import IngredientHeader from '../components/IngredientHeader';
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

  const { abstract, comment } = ingredient.jsonld;
  const descriptions = [abstract, comment]
    .map((localized) => (localized ? localized['@value'] : ''))
    .filter((value) => value)
    .join('\n\n');

  return (
    <Fragment>
      <JsonldHelmet jsonld={JSON.stringify(ingredient.jsonld)} typeLabel='ingredient' />
      <Container>
        <Container maxWidth='xl'>
          <Box pt={6}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <IngredientHeader
                    isLoading={isLoading}
                    error={error}
                    ingredient={ingredient}
                  />
                  <Typography color='text.primary'>
                    {escapeAHrefContent(descriptions)}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions>
                {ingredient.jsonld.isPrimaryTopicOf && (
                  <Button size='small' href={ingredient.jsonld.isPrimaryTopicOf}>
                    View Source
                  </Button>
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
