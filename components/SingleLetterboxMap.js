import { useState, useRef } from "react";
import ReactMapGL, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import GeocoderControl from './GeocoderControl';
export const mapboxAccessToken = process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN;
const SingleLetterboxMap = ({ query }) => {
    const mapRef = useRef(null);
    const [viewState, setViewState] = useState({
        latitude: query ? query.properties.lattitude : "",
        longitude: query ? query.properties.longitude : "",
        zoom: 15
    });

    const onMarkerClick = (evt) => {
        var lngLat = evt.target.getLngLat();
        alert(`Latitude: ${lngLat['lat']}, Longitude: ${lngLat['lng']}`)
    };

    return ( 
        <div>
            <ReactMapGL 
                {...viewState} 
                style={{width: 380, height: 320}}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={`pk.${mapboxAccessToken}`}
                ref={(instance) => (mapRef.current = instance)}
            >
                <GeolocateControl />
                <GeocoderControl mapboxAccessToken={`pk.${mapboxAccessToken}`} position="top-left" viewState={viewState}/>
                <Marker longitude={query.properties.longitude} latitude={query.properties.lattitude} anchor="bottom" onClick={(evt => onMarkerClick(evt))}/>
                <NavigationControl position="bottom-right"/>
            </ReactMapGL>
        </div>
    );
};
   
export default SingleLetterboxMap;
