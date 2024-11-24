import { geoJson } from 'leaflet';
import React, { useEffect, useState } from 'react';
import { Cell, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, ResponsiveContainer, Label, Bar, BarChart, Legend } from 'recharts';

const PlansScatterPlot = ({ stateData, stateSummary, distanceMeasure, selectedCluster, onPlanScatterPointClick }) => {
    const [plans, setPlans] = useState(null);
    const [dist, setDist] = useState(null);
    const [graph, setGraph] = useState('scatter');
    const [distMeasure, setDistMeasure] = useState(null);
    const dict = {
        'Optimal Transport': 'optimaltransport',
        'Hamming Distance': 'hamming',
        'Entropy': 'entropy'

    }
    useEffect(() => {
        const newPlans = new Map();
        const newDist = new Map();

        setDistMeasure(distMeasure)
        for (let clus in stateSummary[dict[distanceMeasure]][selectedCluster]['indices']) {
            newDist.set(stateSummary[dict[distanceMeasure]][selectedCluster]['indices'][String(clus)],
                [stateSummary[dict[distanceMeasure]][selectedCluster]['MDS_X'][String(clus)],
                stateSummary[dict[distanceMeasure]][selectedCluster]['MDS_Y'][String(clus)],
                stateData[stateSummary[dict[distanceMeasure]][selectedCluster]['indices'][String(clus)]]['geojson']]
            );

        }
        setPlans(newPlans);
        setDist(newDist)

    }, [stateData, stateSummary]);

    if (!stateSummary || !stateData || !plans) {
        return <div>Please wait</div>;
    }
    else {
    }
    const data = Array.from(dist).map(([key, value], index) => (
        {
            planId: key,
            mdsx: value[0],
            mdsy: value[1],
            geojson: value[2]
        }
    ))

    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip" style={{ background: 'white', padding: '10px', border: '1px solid #ccc' }}>
                    <p className="label">Plan ID: {payload[0].payload.planId}</p>
                    <p className="desc">MDS X: {payload[0].payload.mdsx}</p>
                    <p className="desc">MDS Y: {payload[0].payload.mdsy}</p>
                    {payload[0].payload.geojson != "NA" ?
                        <p className="desc">Plan Available</p> :
                        <p className="desc">Plan Not Available</p>}
                </div>
            );
        }
        return null;
    };

    const barData = Object.keys(stateSummary['summary']['R-D_Splits']).map((key, index) => ({
        splits: key,
        frequency: stateSummary['summary']['R-D_Splits'][key]
    }));

    const handleScatterClick = (point) => {
        onPlanScatterPointClick(point);
    };

    const switchToScatter = () => {
        setGraph('scatter');
    };

    const switchToBar = () => {
        setGraph('bar');
    };

    return (
        <div>
            <div style={{ margin: '10px' }}>
                <button
                    style={{
                        marginRight: '10px',
                        padding: '10px',
                        backgroundColor: graph === 'scatter' ? '#fff' : '#333',
                        color: graph === 'scatter' ? '#333' : '#fff',
                        border: graph === 'scatter' ? 'solid' : 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={switchToScatter}
                >
                    {distanceMeasure} Scatter Plot
                </button>
                <button
                    style={{
                        padding: '10px',
                        backgroundColor: graph === 'bar' ? '#fff' : '#333',
                        color: graph === 'bar' ? '#333' : '#fff',
                        border: graph === 'bar' ? 'solid' : 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={switchToBar}
                >
                    Rep vs Dem Split Frequency Graph
                </button>
            </div>
            {graph == 'scatter' ? <div className='scatter-plot-details'>
                <ResponsiveContainer width="97%" height={450} >
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 50 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="mdsx" name="MDS X">
                            <Label value="MDS X" offset={0} position="bottom" />
                        </XAxis>
                        <YAxis type="number" dataKey="mdsy" name="MDS Y">
                            <Label value="MDS Y" angle={-90} offset={10} position={"left"} style={{ textAnchor: "middle" }} />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter
                            name="Plans"
                            data={data}
                            fill="#8884d8"
                            onClick={handleScatterClick}
                        >
                            {
                                data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.geojson != "NA" ? 'green' : 'red'} />
                                ))
                            }
                        </Scatter>
                        <Label value="Cluster Summary Scatter Plot" offset={0} position="top" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div> : <div className='bar-graph-details'>
                <ResponsiveContainer width="97%" height={450}>
                    <BarChart
                        width={'100%'}
                        height={'100%'}
                        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                        data={barData}
                    >
                        <CartesianGrid />
                        <XAxis dataKey="splits" name="Republican - Democratic Split">
                            <Label value="Republican - Democratic Split" offset={40} position="bottom" />
                        </XAxis>
                        <YAxis>
                            <Label value="Number of plans" offset={20} position="left" angle={-90} style={{ textAnchor: 'middle' }}/>
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="frequency" fill="#8884d8"></Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>}


        </div>
    );
};

export default PlansScatterPlot;
