node recipes-preprocessing.js
node ingredients-preprocessing.js

cd rdf-data
call run.bat
cd ..

node recipe-urls-generator.js

cd food-com-scraper
call apify run -p
cd ..

node recipes-ingredients-merge-manager.js

node ingredients-postprocessing.js