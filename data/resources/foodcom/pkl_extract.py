import pickle

# open a file, where you stored the pickled data
file = open('ingr_map.pkl', 'rb')

# dump information to that file
data = pickle.load(file)

# close the file
file.close()

print('Showing the pickled data:')

cnt = 0

print(type(data))
print(data)

for item in data:
    print('The data ', cnt, ' is : ', item)
    cnt += 1

data.to_csv ('./ingredients/ingr_map.csv', index = False, header=True)