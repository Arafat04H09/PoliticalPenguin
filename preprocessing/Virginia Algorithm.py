import json
from geopandas import gpd
import pandas
from shapely.geometry import shape
import maup
import matplotlib

f = open('va_gen_20_st_cong_prec.json')
data = json.load(f)
demof = open('Virginia Demo Data.json')
demo = json.load(demof)
assignf = open('virginia_assignment.json')
assignment = json.load(assignf)

'''
shp = "va_gen_20_st_cong_prec.shp"
gdf = gpd.read_file(shp)
vtds = gdf.to_crs(3857)
cgd_shp = "SCV FINAL HOD.shp" # change to which file you want to assign from
cgd = gpd.read_file(cgd_shp)
cgd = cgd.set_index("ID") # change to which property you want to assign
cgd = cgd.to_crs(3857)

vtds_to_cgd_assignment = maup.assign(vtds, cgd)
print(vtds_to_cgd_assignment.isna().sum())
print(vtds_to_cgd_assignment.head())
vtds["CD"] = vtds_to_cgd_assignment
vtds.plot("CD")
matplotlib.pyplot.show()
output = pandas.DataFrame.to_json(vtds_to_cgd_assignment)
with open("virginia_assignment.json", "w") as outfile:
    outfile.write(output)
'''
abbreviation = ['TPOP', 'WPOP', 'BPOP', 'APOP']
result = {}
demo_votes = 0
repu_votes = 0
for i, c in enumerate(data['features']):
    precinct = c['properties']['UNIQUE_ID']
    precinctDemo = c['properties']['UNIQUE_ID'].split(' ')[-1]
    district = int(assignment[str(i)])
    if precinct not in result:
        result[precinct] = {}
    result[precinct]['district'] = district
    result[precinct]['county'] = c['properties']['COUNTYFP']
    result[precinct]['geoid'] = c['properties']['UNIQUE_ID']
    for p in list(demo.keys()):
        target = p.split(',')[0].replace("Voting District", "").strip()
        if target == precinctDemo:
            demolist = [list(demo[p])[0], list(demo[p])[2], list(demo[p])[3], list(demo[p])[5]]
            
            for j in range(4):
                print(demo[p][demolist[j]])
                result[precinct][abbreviation[j]] = int(demo[p][demolist[j]].replace(",", ""))
            break
    '''
    if "TPOP" not in result[precinct]:
        if c['properties']['REG_VOTERS'] != "":
            result[precinct]['TPOP'] = int(c['properties']['REG_VOTERS'])
        else:
            result[precinct]['TPOP'] = 0
    '''
    candidate_code = list(c['properties'].keys())[6:]
    candidate_votes = list(c['properties'].values())[6:]
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
print(demo_votes, repu_votes)

json_object = json.dumps(result, separators=(',', ':'), ensure_ascii=False, indent=0)
with open("Virginia Data TEST.json", "w") as outfile:
    precincts = list(result.items())
    num_precincts = len(precincts)
    outfile.write('{\n')
    for index, (precinct, details) in enumerate(precincts):
        serialized_data = json.dumps({precinct: details}, separators=(',', ':'), ensure_ascii=False)[1:-1]
        if index < num_precincts - 1:
            serialized_data += ',\n'
        outfile.write(serialized_data)
    outfile.write('\n}')