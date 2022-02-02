import os
from rdflib import Graph

def getFilePath(filename):
    current_directory = os.path.dirname(os.path.realpath(__file__))
    return os.path.join(current_directory, filename)

# Create a Graph
graph = Graph()

current_directory = os.path.dirname(os.path.realpath(__file__))

# Parse in an RDF file hosted on the Internet
source_file_path = getFilePath("food-dbpedia-same-ingr.nt")
graph.parse(source_file_path)

# Print the number of "triples" in the Graph
print(f"Graph has {len(graph)} statements.")

sparql_query_path = getFilePath("ingredients-dbpedia.sparql")

with open(sparql_query_path, 'r') as file:
    sparql_query = file.read()
    print(sparql_query)

# Print out the entire Graph in the RDF Turtle format
# print(g.serialize(format="turtle"))

# Apply the query to the graph and iterate through results
for result in graph.query(sparql_query):
    print(result["name"])