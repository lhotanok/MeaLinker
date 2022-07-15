#!/bin/bash

/bin/bash npm install

cd data/resources
/bin/bash npm install

cd foodcom
/bin/bash npm install

cd food-com-scraper
/bin/bash npm install
/bin/bash apify init

cd ../../allrecipes/allrecipes-scraper
/bin/bash npm install
/bin/bash apify init