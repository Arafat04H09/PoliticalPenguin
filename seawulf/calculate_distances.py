import json
from multiprocessing import Pool
from gerrychain import Graph, Partition
import pandas as pd
import OptimalTransport as OT
import numpy as np
import sys


def init_assignments(path: str) -> list[Partition]:
    graph = Graph.from_json("OH_GRAPH.json")
    with open(path) as f:
        obj = json.load(f)
    assignments = [part["assignment"] for part in obj["partitions"]]
    return assignments, graph


def calculate_optimal_transport_single(graph, assignment1, assignment2):
    partition1 = Partition(graph=graph, assignment=assignment1)
    partition2 = Partition(graph=graph, assignment=assignment2)
    return OT.Pair(partition1, partition2).distance


def calculate_optimal_transport(assignments, graph, processes=None):
    pairs = []
    for outer_index, assignment in enumerate(assignments):
        for inner_index in range(outer_index + 1, len(assignments)):
            inner_assignment = assignments[inner_index]
            pairs.append((graph, assignment, inner_assignment))
    with Pool(processes) as pool:
        distances = pool.starmap(calculate_optimal_transport_single, pairs)
        pool.close()
        pool.join()
    return distances


def calculate_hamming_distance_single(nodes, assignment1, assignment2):
    distance = 0
    for node in nodes:
        if assignment1[node] != assignment2[node]:
            distance += 1
    return distance


def calculate_hamming_distance(assignments, graph, processes=None):
    nodes = list(graph.nodes)
    pairs = []
    for outer_index, assignment in enumerate(assignments):
        for inner_index in range(outer_index + 1, len(assignments)):
            inner_assignment = assignments[inner_index]
            pairs.append((nodes, assignment, inner_assignment))
    with Pool(processes) as pool:
        distances = pool.starmap(calculate_hamming_distance_single,
                                 pairs,
                                 round(len(pairs) / len(pool._pool)))
        pool.close()
        pool.join()
    return distances


def conditional_entropy(precincts, totalpop, assignment1, assignment2):
    df = pd.DataFrame()
    df["tpop"] = [precincts[x]["TPOP"] for x in precincts]
    entropy = 0
    df["X"] = [assignment1[precinct] for precinct in precincts]
    df["Y"] = [assignment2[precinct] for precinct in precincts]
    district_intersections = df.groupby(by=["X", "Y"]).sum()
    Y_pops = df.groupby(by="Y").sum()["tpop"]

    district_intersections_rev = df.groupby(by=["Y", "X"]).sum()
    X_pops = df.groupby(by="X").sum()["tpop"]
    for _, row in district_intersections.iterrows():
        if row["tpop"] > 0:
            entropy += (row["tpop"]/totalpop *
                        np.log2(Y_pops[row.name[1]] / row["tpop"]) / 2)
    for _, row in district_intersections_rev.iterrows():
        if row["tpop"] > 0:
            entropy += (row["tpop"]/totalpop *
                        np.log2(X_pops[row.name[1]] / row["tpop"]) / 2)
    return entropy


# Given a list of Partitions, calculate pairwise entropy difference
def calculate_entropy_difference(assignments, graph, processes=None):
    precincts = graph.nodes
    totalpop = sum(precincts[x]["TPOP"] for x in precincts)

    pairs = []
    for outer_index, assignment in enumerate(assignments):
        for inner_index in range(outer_index + 1, len(assignments)):
            inner_assignment = assignments[inner_index]
            pairs.append((precincts, totalpop,
                          assignment, inner_assignment))

    with Pool(processes) as pool:
        distances1 = pool.starmap(conditional_entropy, pairs,
                                  round(len(pairs) / len(pool._pool)))
        pool.close()
        pool.join()
    return distances1


def list_to_matrix(lst, num_plans):
    matrix = np.zeros((num_plans, num_plans))
    idx = 0
    for i in range(num_plans - 1):
        for j in range(i + 1, num_plans):
            matrix[i][j] = lst[idx]
            idx += 1
    matrix += matrix.T
    return matrix


if __name__ == "__main__":
    # calculateDistances [distance measure] [seawulf json output]
    if len(sys.argv != 3):
        raise Exception("Incorrect number of arguments")
    method = sys.argv[1].lower()
    json_path = sys.argv[2]

    assignments, graph = init_assignments(json_path)

    if method == "optimaltransport":
        distances = calculate_optimal_transport(assignments, graph)
    elif method == "hamming":
        distances = calculate_hamming_distance(assignments, graph)
    elif method == "entropy":
        distances = calculate_entropy_difference(assignments, graph)
    else:
        print("Available measures: 'optimaltransport', 'hamming', 'entropy'")
        raise Exception("Invalid distance measure")

    output_name = json_path.removeprefix("sw_outputs/").removesuffix(".json")
    output_name += f"_{method}"
    output_matrix = list_to_matrix(distances, len(assignments))
    np.save(output_name, output_matrix)
