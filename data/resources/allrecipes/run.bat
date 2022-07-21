node ingredients-preprocessing.js

cd rdf-data
call run.bat
cd ..

cd allrecipes-scraper
call apify run -p
cd ..

node ingredients-postprocessing.js