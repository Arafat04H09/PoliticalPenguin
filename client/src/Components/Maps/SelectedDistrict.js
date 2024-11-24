import React from 'react';

const SelectedDistrict = ({ districtData }) => {
    if (!districtData) return null; 

    return (
        <div className='district-popup' style={{
            boxSizing: 'border-box',
        }}>
            <h3>District ID: {districtData.districtId}</h3>
            <p>Population: {districtData.population}</p>
            <p>Area: {districtData.area} sq km</p>
        </div>
    );
}

export default SelectedDistrict;
