#!/bin/bash

node ingredients-preprocessing.js

cd rdf-data
/bin/bash run.sh
cd ..

cd allrecipes-scraper
/bin/bash apify run -p
cd ..

node ingredients-postprocessing.js