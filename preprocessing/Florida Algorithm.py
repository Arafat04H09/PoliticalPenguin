import json
from geopandas import gpd
import pandas
from shapely.geometry import shape
import maup
import matplotlib

f = open('fl_gen_20_st_prec.json')
data = json.load(f)
demof = open('Florida Demo Data.json')
demo = json.load(demof)
assignf = open('florida_assignment.json')
assignment = json.load(assignf)
TPOPf = open('florida_assignment TPOP.json')
TPOP = json.load(TPOPf)
WPOPf = open('florida_assignment WPOP.json')
WPOP = json.load(WPOPf)
BPOPf = open('florida_assignment BPOP.json')
BPOP = json.load(BPOPf)
APOPf = open('florida_assignment APOP.json')
APOP = json.load(APOPf)
GEOIDf = open('florida_assignment GEOID.json')
GEOID = json.load(GEOIDf)

'''
shp = "fl_gen_20_st_prec.shp"
gdf = gpd.read_file(shp)
vtds = gdf.to_crs(3857)
cgd_shp = "Florida Congressional District Plan.shp" # change which file to assign from
cgd = gpd.read_file(cgd_shp)
cgd = cgd.set_index("DISTRICT") # change to which propert to assign
cgd = cgd.to_crs(3857)

vtds_to_cgd_assignment = maup.assign(vtds, cgd)
print(vtds_to_cgd_assignment.isna().sum())
print(vtds_to_cgd_assignment.head())
vtds["DISTRICT"] = vtds_to_cgd_assignment
vtds.plot("DISTRICT")
matplotlib.pyplot.show()
output = pandas.DataFrame.to_json(vtds_to_cgd_assignment)

with open("florida_assignment GEOID.json", "w") as outfile:
    outfile.write(output)
'''

'''

with open("Florida Data Test.json") as f:
    j = json.load(f)

df = pandas.DataFrame.from_dict(j, orient="index")
df["geometry"] = gpd.GeoSeries.from_wkt(df["geometry"])
gdf = gpd.GeoDataFrame(df)
gdf.crs = "EPSG:3857"
gdf.plot("district")
matplotlib.pyplot.show()
'''

demo_votes = 0
repu_votes = 0
result = {}
abbreviation = ['TPOP', 'OPOP', 'WPOP', 'BPOP', 'AAPOP', 'APOP', 'NOPOP', 
                'SPOP', 'TMPOP']
for i, c in enumerate(data['features']):
    precinct = c['properties']['UNIQUE_ID']
    district = int(assignment[str(i)])
    if precinct not in result:
        result[precinct] = {}
    result[precinct]['district'] = district
    result[precinct]['county'] = c['properties']['COUNTYFP']
    result[precinct]['geoid'] = str(GEOID[str(i)])
    result[precinct]['TPOP'] = int(TPOP[str(i)])
    result[precinct]['WPOP'] = int(WPOP[str(i)])
    result[precinct]['BPOP'] = int(BPOP[str(i)])
    result[precinct]['APOP'] = int(APOP[str(i)])

    candidate_code = list(c['properties'].keys())[5:]
    candidate_votes = list(c['properties'].values())[5:]
    democratic = 0
    republican = 0
    for i, code in enumerate(candidate_code):
        if code == 'G20PREDBID':
            demo_votes += candidate_votes[i]
            democratic += candidate_votes[i]
        elif code == 'G20PRERTRU':
            repu_votes += candidate_votes[i]
            republican += candidate_votes[i]
    result[precinct]['democratic'] = democratic
    result[precinct]['republican'] = republican
    result[precinct]["geometry"] = shape(c['geometry']).wkt

f.close()
demof.close()
assignf.close()
TPOPf.close()
WPOPf.close()
BPOPf.close()
APOPf.close()
GEOIDf.close()
print(demo_votes, repu_votes)

json_object = json.dumps(result, separators=(',', ':'), ensure_ascii=False, 
                         indent=0)
with open("Florida Data Test.json", "w") as outfile:
    precincts = list(result.items())
    num_precincts = len(precincts)
    outfile.write('{\n')
    for index, (precinct, details) in enumerate(precincts):
        serialized_data = json.dumps({precinct: details}, separators=(',', ':'),
                                      ensure_ascii=False)[1:-1]
        if index < num_precincts - 1:
            serialized_data += ',\n'
        outfile.write(serialized_data)
    outfile.write('\n}')