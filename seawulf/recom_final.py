from gerrychain import (Graph, Partition, MarkovChain,
                        constraints, accept, Election)
from gerrychain.proposals import recom
from gerrychain.updaters import Tally
from functools import partial
import json
from multiprocessing import Pool, Manager
import sys


def run_chain(path, partitions, lock):
    '''Run markov chain and output partition to file specified by path'''

    graph = Graph.from_json("OH_GRAPH.json")

    election = Election(
        "2020 Presidential",
        {"Democratic": "democratic", "Republican": "republican"},
        alias="PRES20"
    )
    initial_partition = Partition(graph,
                                  assignment="district",
                                  updaters={
                                      "population": Tally("TPOP", alias="population"),
                                      "PRES20": election
                                      })
    pop_target = sum(initial_partition["population"].values()) / len(initial_partition)
    proposal = partial(recom,
                       pop_col="TPOP",
                       pop_target=pop_target,
                       epsilon=0.01,
                       node_repeats=2)
    pop_constraint = constraints.within_percent_of_ideal_population(initial_partition, 0.04)

    chain = MarkovChain(
        proposal=proposal,
        constraints=[pop_constraint],
        accept=accept.always_accept,
        initial_state=initial_partition,
        total_steps=100
    )
    for partition in chain:
        pass
    part = partition

    # Must convert from Partition to dict since Partition is unpickleable
    new_obj = {}
    new_obj["assignment"] = dict(part.assignment)
    new_obj["updaters"] = {
        "population": part["population"],
        "DVote": part["PRES20"].totals_for_party["Democratic"],
        "RVote": part["PRES20"].totals_for_party["Republican"]
    }

    partitions.append(new_obj)

    # Write to file every 500 plans generated
    if (len(partitions) % 500 == 0):
        with lock:
            with open(path, "w") as f:
                json.dump({"partitions": partitions}, f)


def generate_partitions(path: str, n: int = 10, processes: int = None):
    # Run chain across processes
    with Manager() as manager:
        lock = manager.Lock()
        partitions = manager.list()
        with Pool(processes=processes) as pool:
            res = pool.starmap_async(run_chain, [(path, partitions, lock) for _ in range(n)])
            pool.close()
            pool.join()
        res.wait()

        # Write final result to file
        with open(path, "w") as f:
            json.dump({"partitions": list(partitions)}, f)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise Exception("Not enough input arguments")
    path = sys.argv[1]
    n = int(sys.argv[2])

    generate_partitions(path=path, n=n, processes=4)
