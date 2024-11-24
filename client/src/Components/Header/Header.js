import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './Header.css';
import logo from './penguinlogo.png'; // Ensure the path to your logo is correct

const Header = ({ stateName, districtType, handleBackClick, displayButton }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleStateChange = (event) => {
        const selectedState = event.target.value;
        navigate(`/statemap/${selectedState}`);
    };

    const handleUSMapButtonClick = () => {
        if (location.pathname !== '/') {
            handleBackClick();
        }      
        navigate('/');
    };

    return (
        <div className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="header-logo" />
                <span className="logo-text">Penguins</span>
            </div>
            <div className="controls-container">
                <button className="button" onClick={handleUSMapButtonClick}>US Map</button>
                <select
                    className="state-dropdown"
                    onChange={handleStateChange}
                    defaultValue="default"
                >
                    <option value="default" disabled>Select a State</option>
                    <option value="Florida">Florida</option>
                    <option value="Ohio">Ohio</option>
                    <option value="Virginia">Virginia</option>
                </select>
                {stateName && districtType && (
                    <h4 className='header-text'>
                        {stateName} 2022 {districtType} Districts
                    </h4>
                )}
                {displayButton === true &&
                    <button className='button' onClick={handleBackClick} style={{ position: 'absolute', right: '1%' }}>Go Back</button>}
            </div>
        </div>
    );
}

export default Header;