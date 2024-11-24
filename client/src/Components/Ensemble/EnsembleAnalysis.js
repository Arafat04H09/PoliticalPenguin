import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label
} from 'recharts';

const EnsembleAnalysis = ({ stateName }) => {
    const [stateSummary, setStateSummary] = useState(null);
    const [distanceMeasure, setDistanceMeasure] = useState('hamming');
    const fetchData = async (ensemble) => {
        try {
            const summaryResponse = await fetch(`http://localhost:8080/${stateName}/summary`);
            const summaryData = await summaryResponse.json();
            const file = JSON.parse(summaryData['summary']);
            setStateSummary(file);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const dict = {
        'hamming': 'Hamming Distance',
        'entropy': 'Entropy'
    }

    useEffect(() => {
        fetchData();
    }, [stateName]);

    if (!stateSummary) {
        return <>Loading...</>
    }
    else {
    }

    const handleDistanceMeasureChange = (newDistanceMeasure) => {
        setDistanceMeasure(newDistanceMeasure);
    };

    const data = Object.values(stateSummary)
        .map((ens, index) => ({
            size: ens['summary']['nplans'],
            clusters: ens[distanceMeasure]['summary']['nclusters'],
        }))
        .sort((a, b) => a.size - b.size);

    return (
        <div>
            <div style={{ margin: '20px' }}>
                <button
                    onClick={() => handleDistanceMeasureChange('hamming')}
                    style={{
                        marginRight: '50px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        background: distanceMeasure === 'hamming' ? '#77C3EC' : 'lightgray',
                        color: distanceMeasure === 'hamming' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    Hamming
                </button>
                <button
                    onClick={() => handleDistanceMeasureChange('entropy')}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        background: distanceMeasure === 'entropy' ? '#77C3EC' : 'lightgray',
                        color: distanceMeasure === 'entropy' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    Entropy
                </button>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignContent: 'center' }}>
                <div className='chart' style={{ flex: 1, paddingTop: '5vh', height: '70vh' }}>
                    <div className='title' style={{ alignContent: 'center' }}>
                        <h2> Ensemble Size vs Number of Clusters: {dict[distanceMeasure]} </h2>
                    </div>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="size">
                                <Label value="Ensemble Size" offset={-10} position="insideBottom" />
                            </XAxis>
                            <YAxis>
                                <Label value="No. of Clusters" angle={-90} position="insideLeft" />
                            </YAxis>
                            <Tooltip />
                            <Line type="monotone" dataKey="clusters" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className='analysis-table' style={{ flex: 1, paddingTop: '20vh'}}>
                    <div style={{ overflowY: 'auto', alignItems: 'center', textAlign: 'center'  }}>
                        <h2>Data Points</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', justifyContent: 'center', alignContent: 'center' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>Ensemble Size</th>
                                    <th style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>No. of Clusters</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((d, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '20px', fontSize: '16px' }}>{d.size}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '20px', fontSize: '16px' }}>{d.clusters}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnsembleAnalysis;
