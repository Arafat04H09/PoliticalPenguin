/*global L*/
import React, { useEffect, useRef } from "react";
import "../../Styles/Home.css";

const StateMap = ({ plan }) => {
  const mapContainerRef = useRef(null);

  let map;

  useEffect(() => {
    if (plan) {
      if (mapContainerRef.current) {
        const centerLat = 35.2811;
        const centerLng = -81.1081;
        const degreeRange = 15;

        const bounds = L.latLngBounds(
          L.latLng(centerLat - degreeRange, centerLng - degreeRange),
          L.latLng(centerLat + degreeRange, centerLng + degreeRange)
        );

        map = L.map(mapContainerRef.current, {
          zoomControl: false,
          center: [centerLat, centerLng],
          maxZoom: 6.5,
          minZoom: 4,
          maxBounds: bounds,
          maxBoundsViscosity: 1.0,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        if (map && mapContainerRef.current) {
          L.geoJson(plan, {
            onEachFeature: (feature, layer) => {
              layer.on({
                click: () => {

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

  return (
    <div>
      <div className="state-content">
        <div className="map-wrapper">
          <div
            className="map-container"
            style={{ width: "100%", height: "50vh" }}
          >
            <div
              ref={mapContainerRef}
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateMap;