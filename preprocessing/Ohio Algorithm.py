import json
from geopandas import gpd
import pandas
from shapely.geometry import shape
import maup
import matplotlib

codes = {'G20PREDBID': ['Joseph R. Biden Jr', 'D'],
         'G20PRERTRU': ['Donald J. Trump', 'R'],
}


f = open('oh_gen_20_st_prec.json')
data = json.load(f)
demof = open('Ohio Demo Data.json')
demo = json.load(demof)
assignf = open('test.json')
assignment = json.load(assignf)

result = {}

abbreviation = ['TPOP', 'OPOP', 'WPOP', 'BPOP', 'AAPOP', 'APOP', 'NOPOP', 'SPOP', 'TMPOP']
'''
shp = "oh_prim_20_st_prec.shp"
gdf = gpd.read_file(shp)
vtds = gdf.to_crs(3857)
cgd_shp = "oh_cong_adopted_2022.shp" # change to the file to assign from
cgd = gpd.read_file(cgd_shp)
cgd = cgd.set_index("CONG_DIST") # change to which property you want to assign
cgd = cgd.to_crs(3857)

vtds_to_cgd_assignment = maup.assign(vtds, cgd)
print(vtds_to_cgd_assignment.isna().sum())
print(vtds_to_cgd_assignment.head())
vtds["CD"] = vtds_to_cgd_assignment
vtds.plot("CD")
matplotlib.pyplot.show()
output = pandas.DataFrame.to_json(vtds_to_cgd_assignment)
with open("test.json", "w") as outfile:
    outfile.write(output)
'''
demo_votes = 0
repu_votes = 0
for i, c in enumerate(data['features']):
    precinct = c['properties']['GEOID20']
    precinctDemo = c['properties']['NAME20']
    district = int(assignment[str(i)])
    if precinct not in result:
        result[precinct] = {}
    result[precinct]['district'] = district
    result[precinct]['county'] = c['properties']['COUNTYFP']
    result[precinct]['geoid'] = c['properties']['GEOID20']
    for p in list(demo.keys()):
        target = p.split(',')[0]
        if "PRECINCT" not in precinctDemo:
            target = target.replace("PRECINCT", "")
        if target.upper().strip() == precinctDemo:
            demolist = list(demo[p])[:9]
            for i in range(9):
                result[precinct][abbreviation[i]] = int(demo[p][demolist[i]].replace(",", ""))
            break
    if "TPOP" not in result[precinct]:
        if c['properties']['REG_VOTERS'] != "":
            result[precinct]['TPOP'] = int(c['properties']['REG_VOTERS'])
        else:
            result[precinct]['TPOP'] = 0
    candidate_code = list(c['properties'].keys())[9:]
    candidate_votes = list(c['properties'].values())[9:]
    democratic = 0
    republican = 0
    for i, code in enumerate(candidate_code):
        if code not in codes:
            continue
        if codes[code][1] == 'D':
            demo_votes += candidate_votes[i]
            democratic += candidate_votes[i]
        elif codes[code][1] == 'R':
            repu_votes += candidate_votes[i]
            republican += candidate_votes[i]
    result[precinct]['democratic'] = democratic
    result[precinct]['republican'] = republican
    result[precinct]["geometry"] = shape(c['geometry']).wkt

f.close()
demof.close()
assignf.close()
print(demo_votes, repu_votes)

json_object = json.dumps(result, separators=(',', ':'), ensure_ascii=False, indent=0)
with open("Ohio Data NEW.json", "w") as outfile:
    precincts = list(result.items())
    num_precincts = len(precincts)
    outfile.write('{\n')
    for index, (precinct, details) in enumerate(precincts):
        serialized_data = json.dumps({precinct: details}, separators=(',', ':'), ensure_ascii=False)[1:-1]
        if index < num_precincts - 1:
            serialized_data += ',\n'
        outfile.write(serialized_data)
    outfile.write('\n}')
