import { useState, useRef} from "react";
import ReactMapGL, { Marker, Popup, ViewState} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { Image } from 'next/image';
export const mapboxAccessToken = process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN;
const Map = ({ state, query }) => {
    const mapRef = useRef(null);
    const [viewport, setViewport] = useState({
        latitude: 30.04,//query ? query.properties.lattitude : state.lattitude,
        longitude: -99.14,//query ? query.properties.longitude : state.longitude,
        zoom: 10
    });
    return (
        <div className="text-black relative">
            {console.log('viewport:')}
            {console.log(viewport)}
            <ReactMapGL 
                {...viewport} 
                width="100%" 
                height="calc(100vh - 64px)"
                mapboxAccessToken={`pk.${mapboxAccessToken}`}
                onViewportChange={nextViewport => setViewport({nextViewport})}
                ref={(instance) => (mapRef.current = instance)}
                minZoom={5}
                maxZoom={15}
                mapStyle="mapbox://styles/mapbox/outdoors-v11">
            </ReactMapGL>
        </div>
    );
  };
   
  export default Map;

/*
 * If you need Open Street Maps, use this code snippet
 */
// const renderMap = (longitude, latitude) => {
//     return '<iframe width="500" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox='
//     + parseFloat(longitude) + '%2C' + parseFloat(latitude) + '&amp;layer=mapnik&amp;marker=' + parseFloat(latitude) + '%2C' + parseFloat(longitude) + '" style="border: 1px solid black"></iframe>';
// }

// <div id="map" className="flex flex-wrap -mx-3 mb-6">
//     <div className="w-full px-3">
//     {!query ?
//         state.lattitude === "" || state.longitude === "" || isNaN(state.lattitude) || isNaN(state.longitude) ?
//             navigator.geolocation.getCurrentPosition(position => {
//                 const {latitude, longitude} = position.coords;
//                 map.innerHTML = renderMap(longitude, latitude);
//             }) : 
//             navigator.geolocation.getCurrentPosition(position => {
//                 map.innerHTML = renderMap(state.longitude, state.lattitude);
//             })
//         :
//         navigator.geolocation.getCurrentPosition(position => {
//             map.innerHTML = renderMap( query.properties.longitude, query.properties.lattitude);
//         })
//     } 
//     </div>
// </div>

