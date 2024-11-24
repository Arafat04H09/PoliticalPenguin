/*global L*/
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './USMap.css';

const USMap = ({ plan }) => {
    const mapContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (plan) {
            var map;
            if (mapContainerRef.current) {
                map = L.map(mapContainerRef.current, {
                    zoomControl: false,
                    dragging: false,
                    scrollWheelZoom: false,
                    center: [35.2811, -81.1081],
                    zoom: 6
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                if (map && mapContainerRef.current) {
                    L.geoJson(plan, {
                        onEachFeature: (feature, layer) => {
                            layer.on({
                                click: () => {
                                    const stateName = feature.properties.name;
                                    navigate(`/statemap/${stateName}`);
                                }
                            });
                        }
                    }).addTo(map);
                    map.fitBounds(L.geoJson(plan).getBounds());
                }

            }

            return () => {
                if (map) {
                    map.off();
                    map.remove();
                }
            };
        }
    }, [plan]);

    if (!plan) {
        return (<h1>Loading</h1>)
    }
    return (
        <div>
            <h2 className='US-Map'>US Map</h2>
            <div className='US-content'>
                <div className='us-map-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', width: '100%' }}>
                    <div ref={mapContainerRef} style={{ width: '100%', height: '100%', border: 'solid gray 5px'}}></div>
                </div>
            </div>
        </div>
    );
}

export default USMap;
