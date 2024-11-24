import React, { useEffect, useState } from 'react';
import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, Label, ResponsiveContainer } from 'recharts';
import { scaleLinear } from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';

const ScatterPlot = ({ clustersData, selectedCluster }) => {
    const [detailedData, setDetailedData] = useState(null);
    const colorInterpolator = d3Interpolate.interpolateRgb('blue', 'red');

    useEffect(() => {
        if (selectedCluster && clustersData) {
            const clusterPlans = clustersData.clusters[selectedCluster].plans;
            const data = Object.keys(clusterPlans).map(planId => ({
                ...clusterPlans[planId],
                id: planId
            }));
            setDetailedData(data);
        } else {
            setDetailedData(null);
        }
    }, [selectedCluster, clustersData]);

    return (
        <div className="scatter-and-details-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {detailedData ? (
                <div className="scatter-plot-details" style={{ width: '100%' }}>
                    <h3>Plans for {selectedCluster}</h3>
                    <ResponsiveContainer width="100%" height={'100%'}>
                        <ScatterChart width={'100%'} height={'100%'} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis
                                type="number"
                                dataKey="republican_split"
                                name="Republican Split"
                                domain={[0, 100]}
                            >
                                <Label value="Republican Split (%)" offset={-15} position="insideBottom" />
                            </XAxis>
                            <YAxis
                                type="number"
                                dataKey="democratic_split"
                                name="Democratic Split"
                                domain={[0, 100]}
                            >
                                <Label value="Democratic Split (%)" angle={-90} offset={-5} position="insideLeft" />
                            </YAxis>
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter
                                data={detailedData}
                                fill="#8884d8"
                                shape={({ cx, cy, payload }) => {
                                    const percentageRepublican = payload.republican_split / (payload.republican_split + payload.democratic_split);
                                    const fill = colorInterpolator(percentageRepublican);
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={8}
                                            fill={fill}
                                            stroke="#000000"
                                            strokeWidth={1}
                                        />
                                    );
                                }}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <h3>Select a Cluster for Details</h3>
            )}
        </div>
    );
}

export default ScatterPlot;
