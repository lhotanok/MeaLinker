#!/bin/bash

cd resources/foodcom
/bin/bash run.sh
cd ..

/bin/bash run.sh
cd ..

cd database
/bin/bash run.sh
cd ..

cd solr
/bin/bash run.sh
cd ..