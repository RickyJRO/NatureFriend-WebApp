import React from "react";
import './maps.css'
import {
  MapContainer,
  TileLayer,

  MapConsumer
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { divIcon } from "leaflet";
import icon from "./icon";

export default function App(props) {
    var marker = {};
  return (
    <MapContainer
      center={[21.43, -10.7]}
      zoom={2}
       
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapConsumer >
        {(map) => {
          map.on("click", function (e) {
            const { lat, lng } = e.latlng;
            if(marker != undefined){
                map.removeLayer(marker)
            }
            marker = L.marker([lat,lng], {icon}).addTo(map)
            console.log(marker._latlng)
            props.cords(marker._latlng)
          });
          
          return null;
        }}
      </MapConsumer>
    </MapContainer>
  );
}
