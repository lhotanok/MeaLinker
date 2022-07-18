import { FilterHandlers } from '../../../types/Filters';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '../../../../shared/components/TabPanel';
import { Fragment, useState } from 'react';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CuisineIcon from '@mui/icons-material/RamenDining';
import TimeIcon from '@mui/icons-material/AccessTime';
import MealTypeIcon from '@mui/icons-material/BrunchDining';
import CloseIcon from '@mui/icons-material/Close';
import DietIcon from '@mui/icons-material/MonitorWeight';
import AutocompleteSearchBar from '../../../../shared/components/AutocompleteSearchBar';
import { IconButton, Stack, Tooltip } from '@mui/material';

type SecondaryFiltersProps = {
  filterHandlers: FilterHandlers;
};

enum Filters {
  Tags,
  Cuisine,
  MealTypes,
  Time,
  Diets,
}

export default function SecondaryFilters({ filterHandlers }: SecondaryFiltersProps) {
  const [currentTab, setCurrentTab] = useState(-1);

  const { tags, cuisine, diets, mealTypes, time } = filterHandlers;

  const tabs = [
    {
      index: Filters.Tags,
      label: 'Tags',
      filterHandler: tags,
    },
    {
      index: Filters.Cuisine,
      label: 'Cuisine',
      filterHandler: cuisine,
    },
    {
      index: Filters.MealTypes,
      label: 'Meal Type',
      filterHandler: mealTypes,
    },
    {
      index: Filters.Time,
      label: 'Prep Time',
      filterHandler: time,
    },
    {
      index: Filters.Diets,
      label: 'Diet',
      filterHandler: diets,
    },
  ];

  const tabElements = tabs.map((tab) => (
    <Tab key={tab.index} label={tab.label} {...a11yProps(tab.index)} />
  ));

  const tabPanels = tabs.map((tab) => {
    const { value: searched, facets: facetItems, onSearch, onRemove } = tab.filterHandler;

    return {
      facetItems,
      searched,
      label: `Add ${tab.label.toLowerCase()}`,
      placeholder: tab.label,
      onSearch,
      onRemove,
    };
  });

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        pt: 5,
        pb: 5,
      }}
    >
      <Fragment>
        <Box mb={1} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <Tabs
              selectionFollowsFocus
              value={currentTab === -1 ? false : currentTab}
              onChange={(_ev, value: number) => setCurrentTab(value)}
              aria-label='secondary filters'
              variant='scrollable'
              scrollButtons='auto'
            >
              {tabElements}
            </Tabs>
            {currentTab !== -1 && (
              <Tooltip title='Hide filters' enterDelay={500} placement='right-end'>
                <IconButton onClick={() => setCurrentTab(-1)}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
        {currentTab !== -1 && (
          <Fragment>
            <TabPanel value={currentTab} index={Filters.Tags}>
              <AutocompleteSearchBar
                {...tabPanels[Filters.Tags]}
                searchIcon={<LoyaltyIcon color='secondary' />}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={Filters.Cuisine}>
              <AutocompleteSearchBar
                {...tabPanels[Filters.Cuisine]}
                multiple={false}
                searchIcon={<CuisineIcon color='secondary' />}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={Filters.MealTypes}>
              <AutocompleteSearchBar
                searchIcon={<MealTypeIcon color='secondary' />}
                {...tabPanels[Filters.MealTypes]}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={Filters.Time}>
              <AutocompleteSearchBar
                {...tabPanels[Filters.Time]}
                multiple={false}
                searchIcon={<TimeIcon color='secondary' />}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={Filters.Diets}>
              <AutocompleteSearchBar
                searchIcon={<DietIcon color='secondary' />}
                {...tabPanels[Filters.Diets]}
              />
            </TabPanel>
          </Fragment>
        )}
      </Fragment>
    </Box>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};
