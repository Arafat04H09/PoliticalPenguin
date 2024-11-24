import React, { useState, useEffect } from 'react';
import StateMap from "../Components/Maps/StateMap";
import ClusterSummaryTable from "../Components/Clusters/ClusterSummaryTable";
import ScatterPlot from '../Components/Clusters/ScatterPlot';
import EnsembleDisplay from '../Components/Ensemble/EnsembleDisplay';
import EnsembleDataTable from '../Components/Ensemble/EnsembleDataDisplay';
import DistanceMeasureSelection from '../Components/DistanceMeasures/DistanceMeasureSelection';
import DistanceMeasureEffectivenessTable from '../Components/DistanceMeasures/DistanceMeasureEffectivenessTable';
import './State.css';

const Ohio = () => {
    const [dummyData, setDummyData] = useState(null);
    const [map, setMap] = useState(null); 
    const [selectedEnsembleSize, setSelectedEnsembleSize] = useState(null);
    const [selectedMeasure, setSelectedMeasure] = useState(null);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/dummy_state_cluster_data.json`)
            .then(response => response.json())
            .then(result => setDummyData(result))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleEnsembleClick = (size) => {
        setSelectedEnsembleSize(size);
    };

    const [activeComponent, setActiveComponent] = useState('stateInfo'); 

    const [selectedEnsemble, setSelectedEnsemble] = useState(null); 

    const handleEnsembleButtonClick = (ensembleNumber) => {
        setActiveComponent('clusterSummary');
        setSelectedEnsemble(ensembleNumber);
    };

    useEffect(() => {
        if (map) {
            map.invalidateSize();
            
            if (activeComponent) {
                map.setView([34.5, -82], 5.25); 
            } else {
                map.setView([35.2811, -81.1081], 6);  
            }
        }
    }, [activeComponent, map]);
    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'ensembleData':
                return <div className = 'init-data'>
                             <EnsembleDataTable clustersData={dummyData['Ohio']} />
                        </div>;
            case 'clusterSummary':
                return <div className = 'init-data'>
                            <ClusterSummaryTable clustersData={dummyData['Ohio']} />
                        </div>;
            case 'scatterPlot':
                return <div className = 'init-data'>
                            <ScatterPlot clustersData={dummyData['Ohio']} />
                        </div>;
            case 'distanceMeasure':
                return (
                    <div classname = 'init-data'>
                        <DistanceMeasureSelection onSelect={setSelectedMeasure} />
                        {selectedMeasure && <DistanceMeasureEffectivenessTable measureName={selectedMeasure} />}
                    </div>
                );
            case 'ensembleSets':
                return (
                    <div className='init-data'>
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(ensembleNumber => (
                            <button 
                                key={ensembleNumber}
                                className="state-button" 
                                onClick={() => handleEnsembleButtonClick(ensembleNumber)}
                            >
                                {`Ensemble ${ensembleNumber}`}
                            </button>
                        ))}
                    </div>
                );
            case 'stateInfo':
                return (
                    <div>
                        <h4>State Summary for Ohio</h4>
                        <div>
                            <strong> Population: 20,278,329</strong>
                        </div>
                        <div>
                            <strong>Number of Districts: 25</strong> 
                        </div>
                        <div>
                            <strong>Demographics:</strong>
                            <ul className = 'nobullets'>
                                <li>African American:10%</li>
                                <li>White: 60%</li>
                                <li>Hispanic:15%</li>
                                <li>Asian: 8%</li>
                                <li>Others:7%</li>
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
            }
        };
    
        if (!dummyData) return <div>Loading...</div>;
    
        return (
            <div>
                <h2> Ohio 2022 Federal Congressional Districts </h2>
                <div className={`state-container ${activeComponent ? 'data-active' : ''}`}>
                    <div className="map-section sticky-map">
                        <StateMap stateName='Ohio' />
                    </div>
                    <div className = "all-data">
                        <div className="state-button-container">
                            <button className = {"state-button"} onClick={() => setActiveComponent('stateInfo')}>State Summary</button>
                            <button className = {"state-button"} onClick={() => setActiveComponent('ensembleSets')}>Ensemble Sets</button>
                            <button className = {"state-button"} onClick={() => setActiveComponent('ensembleData')}>Ensemble Data</button>
                            <button className = {"state-button"} onClick={() => setActiveComponent('clusterSummary')}>Cluster Summary</button>
                            <button className = {"state-button"} onClick={() => setActiveComponent('scatterPlot')}>Cluster Scatter Plot</button>
                            <button className = {"state-button"} onClick={() => setActiveComponent('distanceMeasure')}>Distance Measures</button>
                        </div>
                        <br/>
                        <div className="data-section">
                            {renderActiveComponent()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    export default Ohio;