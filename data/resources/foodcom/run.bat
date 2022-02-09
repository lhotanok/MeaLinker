cd recipes
call run.bat
cd ..

node recipe-urls-generator.js

cd food-com-scraper
call apify run -p
cd ..

node recipes-ingredients-merge-manager.js
node rdf-ingredients-converter.js

cd rdf-data
call run.bat
cd ..

node ingredients-merge-manager.js