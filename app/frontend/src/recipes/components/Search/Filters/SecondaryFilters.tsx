import { FilterHandlers } from '../../../types/Filters';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '../../../../shared/components/TabPanel';
import { Fragment, useState } from 'react';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CuisineIcon from '@mui/icons-material/RamenDining';
import RatingIcon from '@mui/icons-material/Star';
import AutocompleteSearchBar from '../../../../shared/components/AutocompleteSearchBar';

type SecondaryFiltersProps = {
  filterHandlers: FilterHandlers;
};

enum Filters {
  Tags,
  Cuisine,
  Rating,
}

export default function SecondaryFilters({ filterHandlers }: SecondaryFiltersProps) {
  const [currentTab, setCurrentTab] = useState(0);

  const { tags, cuisine } = filterHandlers;

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
      index: Filters.Rating,
      label: 'Rating',
      filterHandler: cuisine,
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
        pt: 4,
      }}
    >
      <Fragment>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={(_ev, value: number) => setCurrentTab(value)}
            aria-label='secondary filters'
            variant='scrollable'
            scrollButtons='auto'
          >
            {tabElements}
          </Tabs>
        </Box>
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
        <TabPanel value={currentTab} index={Filters.Rating}>
          <AutocompleteSearchBar
            multiple={false}
            searchIcon={<RatingIcon color='secondary' />}
            {...tabPanels[Filters.Rating]}
          />
        </TabPanel>
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
