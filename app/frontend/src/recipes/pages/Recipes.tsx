import { Container, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import { Fragment, useState } from 'react';
import KeepAlive from 'react-activation';
import { useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import useSnackbar from '../../shared/hooks/use-snackbar';
import RecipesPage from '../components/Search/RecipesCached';
import { Filters } from '../../shared/tools/filters-enum';

/**
 * Wrapper component used to set `cacheKey` property of `KeepAlive` komponent properly.
 * @returns
 */
export default function RecipesWrapper() {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(-1);

  const { snackbar, setNewSnackbarText: setSnackbar } = useSnackbar();

  const tabItems = [
    {
      index: Filters.Tags,
      label: 'Tags',
    },
    {
      index: Filters.Cuisine,
      label: 'Cuisine',
    },
    {
      index: Filters.MealTypes,
      label: 'Meal Type',
    },
    {
      index: Filters.Time,
      label: 'Prep Time',
    },
    {
      index: Filters.Diets,
      label: 'Diet',
    },
  ];

  const tabElements = tabItems.map((tab) => (
    <Tab key={tab.index + 1} label={tab.label} {...a11yProps(tab.index + 1)} />
  ));

  const tabs = (
    <Fragment>
      <Tabs
        selectionFollowsFocus
        value={currentTab === -1 ? false : currentTab}
        onChange={(_ev, value) => setCurrentTab(Number(value))}
        aria-label='secondary filters'

        // Causes type error, more library users are experiencing the same
        // variant='scrollable'
        // scrollButtons='auto'
      >
        {tabElements}
      </Tabs>
      <Tooltip title='Hide filters' enterDelay={500} placement='right-end'>
        <IconButton onClick={() => setCurrentTab(-1)}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );

  const { search } = location;
  const cacheKey = `recipes-${search}`;

  return (
    <Container>
      {snackbar}
      <KeepAlive cacheKey={cacheKey} id={cacheKey}>
        <RecipesPage setSnackbar={setSnackbar} tabs={tabs} currentTab={currentTab} />
      </KeepAlive>
    </Container>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
