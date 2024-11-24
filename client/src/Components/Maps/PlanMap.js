/*global L*/
import React, { useEffect, useRef } from "react";
import "../../Styles/Home.css";

const PlanMap = ({ plan, planId }) => {
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

        L.Control.textbox = L.Control.extend({
          onAdd: function(map) {
            var text = L.DomUtil.create('div');
            text.id = 'info_text';
            text.innerHTML = '<strong>Plan ' + planId + '</strong>';
            text.style.fontSize = '36px'
            return text;
          },
        
          onRemove: function(map) {
            // Nothing to do here
          }
        });
        
        L.control.textbox = function(opts) {
          return new L.Control.textbox(opts);
        };
        
        L.control.textbox({ position: 'topleft' }).addTo(map);
        
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
    return (
      <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Plan Not Available</h1>
      </div>)
  }
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

export default PlanMap;