import L from "leaflet";
import img from './icon.png'
const icon = L.icon({
    iconSize: [100, 55],
    iconAnchor: [50,51],
    popupAnchor: [2, -40],
    iconUrl: img,
  });
  
  export default icon;