import React from 'react';
import { Cell, ScatterChart, CartesianGrid, XAxis, YAxis, ZAxis, Tooltip, Scatter, Label, ResponsiveContainer } from 'recharts';
import * as d3Interpolate from 'd3-interpolate';

const ClusterSummaryScatterPlot = ({ stateSummary, onClusterSelect, distanceMeasure }) => {
    const colorInterpolator = d3Interpolate.interpolateRgb('blue', 'red');
    const dict = {
        'Optimal Transport': 'optimaltransport',
        'Hamming Distance': 'hamming',
        'Entropy': 'entropy'

    }

    if (!stateSummary) {
        return <div>Please wait</div>
    }
    else {
    }
    const data = stateSummary[dict[distanceMeasure]]
        ? Object.keys(stateSummary[dict[distanceMeasure]])
            .slice(0, stateSummary[dict[distanceMeasure]]['summary']['nclusters'])
            .map((cluster, index) => ({
                cluster: index,
                mdsx: stateSummary[dict[distanceMeasure]]['summary']['MDS_X'][index],
                mdsy: stateSummary[dict[distanceMeasure]]['summary']['MDS_Y'][index],
                size: stateSummary[dict[distanceMeasure]][cluster]['indices'].length,
            }))
        : [];


    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip" style={{ background: 'white', padding: '10px', border: '1px solid #ccc' }}>
                    <p className="label">Cluster {payload[0].payload.cluster}</p>
                    <p className="desc">MDS X: {payload[0].payload.mdsx}</p>
                    <p className="desc">MDS Y: {payload[0].payload.mdsy}</p>
                    <p className="desc">Size: {payload[0].payload.size}</p>
                </div>
            );
        }
        return null;
    };

    const handleClusterSelect = (data) => {
        onClusterSelect('cluster_' + data.cluster);
    };
    
    return (
        <div style={{ height: '100%' }}>
            <h3> Cluster Summary Scatter Plot </h3>
            <div className='scatter-plot-details'>
                <ResponsiveContainer width="97%" height={380} >
                    <ScatterChart width={'100%'} height={'100%'} margin={{ top: 20, right: 20, bottom: 40, left: 50 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="mdsx" name="MDS X"  >
                            <Label value="MDS X" offset={0} position="bottom" />
                        </XAxis>
                        <YAxis type="number" dataKey="mdsy" name="MDS Y">
                            <Label value="MDS Y" angle={-90} offset={10} position={"left"} style={{ textAnchor: "middle" }} />
                        </YAxis>

                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <ZAxis type="number" dataKey="size" range={[40, 1000]} />
                        <Scatter
                            name="Clusters"
                            data={data}
                            fill="#8884d8"
                            onClick={handleClusterSelect}
                        />
                        <Label value="Cluster Summary Scatter Plot" offset={0} position="top" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ClusterSummaryScatterPlot;
