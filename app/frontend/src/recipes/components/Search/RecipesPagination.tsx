import { Box, CircularProgress, Container, PaginationItem, Stack } from '@mui/material';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FlexBox from '../../../shared/components/FlexBox';
import {
  MAX_PAGINATION_PAGES,
  QUERY_PARAM_NAMES,
  RENDERING_TIMEOUT,
} from '../../constants';

type RecipesPaginationProps = {
  queryParams: URLSearchParams;
  page?: number;
  maxPages?: number;
  onScroll?: () => void;
};

export default function RecipesPagination({
  queryParams,
  onScroll,
  page = 1,
  maxPages = MAX_PAGINATION_PAGES,
}: RecipesPaginationProps) {
  const [paginationLoading, setPaginationLoading] = useState(false);
  const location = useLocation();

  const scrollToTopHandler = () => {
    setPaginationLoading(true);

    setTimeout(() => {
      setPaginationLoading(false);
      if (onScroll) {
        onScroll();
      } else {
        window.scrollTo(0, 0);
      }
    }, RENDERING_TIMEOUT);
  };

  const circularProgressPlaceholder = <Box width='40px' height='40px' />;

  return (
    <Container maxWidth='sm'>
      <Box pt='10%'>
        <Stack direction='column' spacing={4}>
          <Pagination
            page={page}
            count={maxPages}
            onChange={scrollToTopHandler}
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
                  to={`${location.pathname}?${updatedQueryParams.toString()}`}
                  {...item}
                />
              );
            }}
          />
          <FlexBox
            children={
              paginationLoading ? (
                <CircularProgress color='secondary' />
              ) : (
                circularProgressPlaceholder
              )
            }
          />
        </Stack>
      </Box>
    </Container>
  );
}
