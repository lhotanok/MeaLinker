import { Breadcrumbs, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import LinkRouter from '../../../shared/components/LinkRouter';

type RecipeBreadcrumbsProps = {
  recipeName: string;
};

export default function RecipeBreadcrumbs({ recipeName }: RecipeBreadcrumbsProps) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize='small' />}
      aria-label='breadcrumb'
    >
      <LinkRouter underline='hover' color='inherit' to='/recipes'>
        <SearchIcon sx={{ mr: 0.5 }} fontSize='inherit' />
        Recipes
      </LinkRouter>
      <Typography sx={{ display: 'flex', alignItems: 'center' }} color='text.primary'>
        {recipeName}
      </Typography>
    </Breadcrumbs>
  );
}
