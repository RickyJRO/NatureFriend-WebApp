import React,{useState} from "react";
import './maps.css'
import {
  MapContainer,
  TileLayer,
    Marker,
    Popup,
  MapConsumer
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { divIcon } from "leaflet";
import icon from "./icon2";
import Moment from 'react-moment';

export default function Maps(props) {
  const [foto, setFoto] = useState(null);
  const position = [50,0];

 
  function setPhoto(photo){
    try{
      console.log(photo)
        console.log(photo.split("_").length)
        if(photo.split("_").length > 1){
            return 'https://naturefriend-mobile.herokuapp.com/' + photo
        }else{
            return '/' + photo
        }
    }catch{
        return '/' + photo
    }
    
}


  return (
    <MapContainer center={position} zoom={3}>
    <TileLayer
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
      {props.markers && props.markers.map(post => (console.log(post),<>
        <Marker icon={icon} position={[post.post_lat,post.post_lng]}>
        <Popup>
          <div className="popup__container">
          <Moment format="YYYY/MM/DD">{post.post_date}</Moment>
            <br></br> <br></br>
          {post.post_title}<br></br> <br></br>
          {post.post_description}<br></br><br></br>
          <img src={setPhoto(post.post_img)} className="imgpopup"/>
          </div>
        </Popup>
      </Marker>
      </>
       ))}
      
    
  </MapContainer>
  );
}
