import pandas as pd

def create_unique_ingr_file(ingredients):
    print('Creating unique ingredients...')

    replaced = ""
    prev_id = -1

    unique_ingr_file = open('./ingredients/unique_ingr_map.csv', 'w')
    unique_ingr_file.write('id,name\n')

    for _, row in ingredients.iterrows():
        if row['replaced'] != replaced:
            if replaced != "" and prev_id != -1 and appropriate_field(replaced):
                unique_ingr_file.write(str(prev_id) + ',' + replaced + '\n')
            replaced = row['replaced']
            prev_id = row['id']

    if replaced != "" and prev_id != -1:
        unique_ingr_file.write(str(prev_id) + ',' + replaced + '\n')

    unique_ingr_file.close()

    print('Unique ingredients created and stored in: ingredients/unique_ingr_map.csv')

def words_count(whitespace_count):
    return whitespace_count + 1

def appropriate_field(line):
    whitespace_count = 0

    for character in line:
        if character == ',':
            return False
        if character == ' ':
            whitespace_count += 1

    return words_count(whitespace_count) < 6

def create_ingredients_recipes_map_file(ingredients_dict, recipes):
    print('Creating mapping between recipes and ingredients...')

    ingr_recipes_file = open('./ingredients/ingr_recipes_map.csv', 'w')
    ingr_recipes_pairs_file = open('./ingredients/ingr_recipes_pairs.csv', 'w')

    ingr_recipes_file.write('ingr_id,recipe_ids\n')
    ingr_recipes_pairs_file.write('ingr_id,recipe_id\n')

    for _, row in recipes.iterrows():
        ingredients = eval(row['ingredient_ids'])
        for ingredient_id in ingredients:
            if (ingredient_id in ingredients_dict):
                recipe_id = row['id']
                ingredients_dict[ingredient_id].append(recipe_id)

    for ingredient_id, recipe_ids in ingredients_dict.items():
        ingr_recipes_file.write(str(ingredient_id) + ',\"' + str(recipe_ids) + '\"\n')
        for recipe_id in recipe_ids:
            ingr_recipes_pairs_file.write(str(ingredient_id) + ',' + str(recipe_id) + '\n')

    ingr_recipes_file.close()
    ingr_recipes_pairs_file.close()

    print('Created 2 new files:\n\tingredients/ingr_recipes_map.csv\n\tingredients/ingr_recipes_pairs.csv')

def main():
    ingredients = pd.read_csv('./ingredients/ingr_map.csv')
    create_unique_ingr_file(ingredients)

    unique_ingredients = pd.read_csv('./ingredients/unique_ingr_map.csv')

    series_ingr_ids = unique_ingredients.id
    dict_ingr_ids = series_ingr_ids.to_dict()

    res_dict_ingr_ids = dict((v,[]) for k,v in dict_ingr_ids.items())

    print('Reading tokenized recipes from PP_recipes.csv...')
    tokenized_recipes = pd.read_csv('./recipes/PP_recipes.csv')
    print('Tokenized recipes from PP_recipes.csv loaded')

    create_ingredients_recipes_map_file(res_dict_ingr_ids, tokenized_recipes)

main()