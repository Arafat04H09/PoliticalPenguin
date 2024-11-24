import React from 'react';
import { generateDistanceMeasures } from '../../Utils/generateDistanceMeasures';
import { useState } from 'react';
import './DistanceMeasure.css';

const DistanceMeasureSelection = ({ onSelect }) => {
    const [selectedMeasure, setSelectedMeasure] = useState(null);
    const measures = generateDistanceMeasures();

    const handleSelect = (measure) => {
        setSelectedMeasure(measure);
        onSelect(measure);
    }

    return (
        <div>
            <h3>Select a Distance Measure:</h3>
            <div className="measure-buttons-container">
                {measures.map(measure => (
                   <button 
                   key={measure} 
                   onClick={() => handleSelect(measure)} 
                   className={`button ${selectedMeasure === measure ? 'active-measure-button' : ''}`}
                    >
                        {measure}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DistanceMeasureSelection;
