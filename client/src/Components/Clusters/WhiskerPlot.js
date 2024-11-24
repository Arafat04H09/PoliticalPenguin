import React, { useState, useEffect } from 'react';
import { VictoryBoxPlot, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

const WhiskerPlot = ({ stateSummary, distanceMeasure }) => {
    const [summary, setSummary] = useState(null)
    const [data, setData] = useState(null)

    const dict = {
        'Optimal Transport': 'optimaltransport',
        'Hamming Distance': 'hamming',
        'Entropy': 'entropy'

    }

    useEffect(() => {
        setSummary(stateSummary);
    }, [stateSummary]);

    if (!stateSummary) {
        return (<></>)
    }
    else {
    }

    const testdata = [
        {
            x: 'Ham-\nming',
            min: parseFloat(Math.max(stateSummary['hamming']['summary']['box_whisker_data']['low'],
                stateSummary['hamming']['summary']['box_whisker_data']['min'])).toFixed(2),
            median: parseFloat(stateSummary['hamming']['summary']['box_whisker_data']['median']).toFixed(2),
            max: parseFloat(Math.min(stateSummary['hamming']['summary']['box_whisker_data']['high'],
                stateSummary['hamming']['summary']['box_whisker_data']['max'])).toFixed(2),
            q1: parseFloat(stateSummary['hamming']['summary']['box_whisker_data']['Q1']).toFixed(2),
            q3: parseFloat(stateSummary['hamming']['summary']['box_whisker_data']['Q3']).toFixed(2),
        },
        {
            x: 'Ent-\nropy',
            min: parseFloat(Math.max(stateSummary['entropy']['summary']['box_whisker_data']['low'],
                stateSummary['entropy']['summary']['box_whisker_data']['min'])).toFixed(2),
            median: parseFloat(stateSummary['entropy']['summary']['box_whisker_data']['median']).toFixed(2),
            max: parseFloat(Math.min(stateSummary['entropy']['summary']['box_whisker_data']['high'],
                stateSummary['entropy']['summary']['box_whisker_data']['max'])).toFixed(2),
            q1: parseFloat(stateSummary['entropy']['summary']['box_whisker_data']['Q1']).toFixed(2),
            q3: parseFloat(stateSummary['entropy']['summary']['box_whisker_data']['Q3']).toFixed(2),
        },
        stateSummary['optimaltransport'] && {
            x: 'Opt-\ntimal\nTran-\nsport',
            min: parseFloat(Math.max(stateSummary['optimaltransport']['summary']['box_whisker_data']['low'],
                stateSummary['optimaltransport']['summary']['box_whisker_data']['min'])).toFixed(2),
            median: parseFloat(stateSummary['optimaltransport']['summary']['box_whisker_data']['median']).toFixed(2),
            max: parseFloat(Math.min(stateSummary['optimaltransport']['summary']['box_whisker_data']['high'],
                stateSummary['optimaltransport']['summary']['box_whisker_data']['max'])).toFixed(2),
            q1: parseFloat(stateSummary['optimaltransport']['summary']['box_whisker_data']['Q1']).toFixed(2),
            q3: parseFloat(stateSummary['optimaltransport']['summary']['box_whisker_data']['Q3']).toFixed(2),
        },
    ].filter(Boolean);

    return (
        <div style={{ height: '80%', display: 'flex', justifyContent: 'center' }}>
            <div>
                <VictoryChart theme={VictoryTheme.material} horizontal width={700} >
                    <VictoryAxis tickValues={[0, 1, 2, 3, 4]} />
                    <VictoryAxis dependentAxis />
                    <VictoryBoxPlot
                        domain={[0, 1.5]}
                        labels
                        labelOrientation="top"
                        data={testdata}
                        style={{
                            q1: { fill: "black" },
                            q3: { fill: "black" },
                            median: { stroke: "white", strokeWidth: 2 },
                        }}

                    />
                </VictoryChart>
            </div>
        </div>
    );
};

export default WhiskerPlot;