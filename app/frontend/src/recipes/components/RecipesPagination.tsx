import { Box, Container, PaginationItem } from '@mui/material';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import { MAX_PAGINATION_PAGES, QUERY_PARAM_NAMES } from '../constants';

type RecipesPaginationProps = {
  page?: number;
  maxPages?: number;
  queryParams: URLSearchParams;
};

export default function RecipesPagination({
  page = 1,
  maxPages = MAX_PAGINATION_PAGES,
  queryParams,
}: RecipesPaginationProps) {
  return (
    <Container maxWidth='sm'>
      <Box padding='10%'>
        <Pagination
          page={page}
          count={maxPages}
          color='secondary'
          size='large'
          sx={{ [`& .${paginationClasses.ul}`]: { justifyContent: 'center' } }}
          renderItem={(item) => {
            const updatedQueryParams = queryParams;
            const itemPage = item.page || 1;
            updatedQueryParams.set(QUERY_PARAM_NAMES.PAGE, itemPage.toString());

            return (
              <PaginationItem
                component={Link}
                to={`/recipes?${updatedQueryParams.toString()}`}
                {...item}
              />
            );
          }}
        />
      </Box>
    </Container>
  );
}
