`RAW_recipes.csv` and `PP_recipes.csv` datasets should be downloaded to the cloned repository manually from Kaggle: 
https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions.
You might be required to log in Kaggle to be able to download the datasets. Both datasets are expected to be stored
in the current directory.

Once `RAW_recipes.csv` file is downloaded, `run.bat` script can be invoked to convert csv recipes to json
format stored in `RAW_recipes.json` file. The number of converted recipes can be easily specified in
`constants.js`, namely through `RECIPES_TO_CONVERT` value.