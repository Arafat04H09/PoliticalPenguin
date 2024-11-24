from functools import partial
import json
import geopandas as gpd
from gerrychain.updaters import Tally
import maup
from gerrychain import GeographicPartition, Partition, Graph
import pandas as pd
import OptimalTransport as OP
from gerrychain import Graph, Partition, MarkovChain, proposals, constraints, accept
from gerrychain.proposals import recom
from tqdm import tqdm
from sklearn.manifold import MDS
from shapely import set_precision


with open("Florida Data Test.json") as f:
    j = json.load(f)

df = pd.DataFrame.from_dict(j, orient="index")
df["geometry"] = gpd.GeoSeries.from_wkt(df["geometry"])
df["geometry"] = set_precision(df["geometry"], 1e-3)
df.loc[df["TPOP"] == 0, 
       "TPOP"] = df.loc[df["TPOP"] == 0, 
                        "democratic"] + df.loc[df["TPOP"] == 0, "republican"]
gdf = gpd.GeoDataFrame(df)
gdf.crs = "EPSG:3857"
gdf["geometry"] = maup.autorepair(gdf["geometry"])

graph = Graph.from_geodataframe(gdf)
def connect_islands_by_geoid(geoid1, geoid2, graph=graph):
    geoid1_node, geoid2_node = 0, 0
    for node in graph:
        if graph.nodes[node]["geoid"] == geoid1:
            geoid1_node = node
        if graph.nodes[node]["geoid"] == geoid2:
            geoid2_node = node
        if (geoid1_node and geoid2_node):
            break
    graph.add_edge(geoid1_node, geoid2_node)

graph.to_json("FL_GRAPH.json", include_geometries_as_geojson=True)
'''
graph = Graph.from_json("FL_GRAPH.json")
initial_partition = Partition(graph,
                             assignment="district",
                             updaters={"population": Tally("TPOP", 
                             alias="population")})
pop_target = sum(initial_partition["population"].values()) / len(
    initial_partition)
proposal = partial(recom,
                   pop_col="TPOP",
                   pop_target=pop_target,
                   epsilon=0.01,
                   node_repeats=2)
pop_constraint = constraints.within_percent_of_ideal_population(
    initial_partition, 0.05)
chain = MarkovChain(
    proposal=proposal,
    constraints=[pop_constraint],
    accept=accept.always_accept,
    initial_state=initial_partition,
    total_steps=50
)
plans = []
i = 0
for partition in chain:
    plans.append(partition)
    if i == 49:
        new_part = partition
    i += 1

distances = {}
print(plans)
# run optimal transport on new_part and initial_part
for outer_index, plan in tqdm(enumerate(plans)):
    for inner_index in range(outer_index + 1, len(plans)):
        inner_plan = plans[inner_index]
        distances[outer_index, inner_index] = OP.Pair(plan, inner_plan).distance
        print(outer_index)
print(distances)
mds = MDS(n_components=2, random_state=0, dissimilarity='precomputed')
pos = mds.fit(distances).embedding_

print(mds)
print(pos)
'''