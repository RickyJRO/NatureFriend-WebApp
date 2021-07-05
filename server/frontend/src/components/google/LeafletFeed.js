import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import icon from './icon2'

export default function App(props) {
 


  return (
    <div className='leafletPosts'>
    <MapContainer center={[props.lat, props.lng]} zoom={6} >
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[props.lat, props.lng]} icon={icon}>
    </Marker>
  </MapContainer>
  </div>
  );
}
