#!/bin/bash

node recipes-preprocessing.js
node ingredients-preprocessing.js

cd rdf-data
/bin/bash run.sh
cd ..

node recipe-urls-generator.js

cd food-com-scraper
/bin/bash apify run -p
cd ..

node recipes-ingredients-merge-manager.js

node ingredients-postprocessing.js