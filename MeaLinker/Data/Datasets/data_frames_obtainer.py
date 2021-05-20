# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import pandas as pd
import numpy

ingredients = pd.read_csv('ingr_map.csv')
unique_ingredients = ingredients.replaced.unique()

raw_recipes = pd.read_csv('RAW_recipes.csv')
tokenized_recipes = pd.read_csv('PP_recipes.csv')


