import { FilterHandlers } from '../../../types/Filters';
import Box from '@mui/material/Box';
import TabPanel from '../../../../shared/components/TabPanel';
import { Fragment } from 'react';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CuisineIcon from '@mui/icons-material/RamenDining';
import TimeIcon from '@mui/icons-material/AccessTime';
import MealTypeIcon from '@mui/icons-material/BrunchDining';
import DietIcon from '@mui/icons-material/MonitorWeight';
import AutocompleteSearchBar from '../../../../shared/components/AutocompleteSearchBar';
import { Stack } from '@mui/material';
import { Filters } from '../../../../shared/tools/filters-enum';

type SecondaryFiltersProps = {
  filterHandlers: FilterHandlers;
  tabs: JSX.Element;
  currentTab: number;
};

export default function SecondaryFilters({
  filterHandlers,
  tabs,
  currentTab,
}: SecondaryFiltersProps) {
  const { tags, cuisine, diets, mealTypes, time } = filterHandlers;

  const tabItems = [
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

  const tabPanels = tabItems.map((tab) => {
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

  console.log(JSON.stringify(tabPanels[Filters.Tags], null, 2));

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
            {tabs}
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
