import json
import pandas as pd
import geopandas as gpd
from shapely import union_all, coverage_union_all
from shapely.errors import GEOSException
from shapely.geometry import shape
import sys


def calculate_splits(path):
    with open(path) as f:
        obj = json.load(f)

    rsplits = []
    dsplits = []

    for plan in obj["partitions"]:
        updaters = plan["updaters"]
        split = [
                    0
                    if updaters["DVote"][cd] > updaters["RVote"][cd]
                    else 1
                    for cd in updaters["DVote"]
                ]
        rsplits.append(sum(split))
        dsplits.append(sum(map(lambda x: 1-x, split)))

    df = pd.DataFrame({"RSplit": rsplits, "DSplit": dsplits})
    return df


def agg_plan_info(path, n=0):
    '''Aggregate information from the first n plans from json specified by path
       Unavailable plans will have geojson: NA'''

    with open("OH_GRAPH.json") as f:
        obj = json.load(f)
        nodes = obj["nodes"]

    df = pd.DataFrame().from_dict(nodes)
    df = df.set_index("id", drop=True)
    df["geometry"] = df["geometry"].apply(shape)
    gdf = gpd.GeoDataFrame(df)
    with open(path) as f:
        obj = json.load(f)

    splits = calculate_splits(path).to_dict("index")

    json_obj = {}
    partitions = obj["partitions"]
    incl_geojson = True
    for i in range(len(partitions)):
        if (i and i >= n):
            incl_geojson = False
            geojson = "NA"

        print(i)
        gdf["district"] = partitions[i]["assignment"]

        # Simplify the geometry to save space
        if incl_geojson:
            simplified_geom = {}
            geometry_by_district = gdf[["district", "geometry"]].groupby(by="district")
            try:
                for idx, grp in geometry_by_district:
                    simplified_geom[idx] = [coverage_union_all(grp["geometry"])]
            except GEOSException:
                for idx, grp in geometry_by_district:
                    simplified_geom[idx] = [union_all(grp["geometry"])]
            simplified = gpd.GeoDataFrame().from_dict(simplified_geom,
                                                      orient="index",
                                                      columns=["geometry"],
                                                      crs="EPSG:3857")
            simplified["geometry"] = simplified["geometry"].apply(lambda x: x.simplify(0.01))
            simplified["district"] = simplified.index
            geojson = eval(simplified.to_json())

        # Combine splits data with geojson
        json_obj[i] = {
            "geojson": geojson,
            "RSplit": splits[i]["RSplit"],
            "DSplit": splits[i]["DSplit"]
        }

    op_name = path.removeprefix("sw_outputs/").removesuffix(".json")
    with open(f"[{n}]{op_name}final.json", "w") as f:
        json.dump(json_obj, f)


if __name__ == "__main__":
    # agg_plans [seawulf output json] [# plans to sample]
    if len(sys.argv != 3):
        raise Exception("Incorrect number of arguments")
    json_path = sys.argv[1]
    n = sys.argv[2]

    agg_plan_info(json_path, n)
