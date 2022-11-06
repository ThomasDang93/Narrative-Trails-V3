import { useState, useRef, useEffect} from "react";
import ReactMapGL, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import GeocoderControl from './GeocoderControl';
import * as  constants from '../util/constants.js';
export const mapboxAccessToken = process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN;
const useCurrentMapLocation = () => {
    const mapRef = useRef(null);
    const [viewState, setViewState] = useState({
        latitude: "",
        longitude: "",
        zoom: 15
    });

    useEffect(() => {
       navigator.geolocation.getCurrentPosition(pos => {
            setViewState({
                ...viewState,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            });
        });
    }, []);

    const onMarkerClick = (evt) => {
        var lngLat = evt.target.getLngLat();
        alert(`Latitude: ${lngLat['lat']}, Longitude: ${lngLat['lng']}`)
    };

    return {
        viewState,
        renderMap:( 
            <div className="justify-center">
                {console.log(typeof constants.MAP_OUTDOORS_STYLE)}
                <ReactMapGL 
                    {...viewState} 
                    style={{width: 380, height: 320}}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle={constants.MAP_OUTDOORS_STYLE}
                    mapboxAccessToken={`pk.${mapboxAccessToken}`}
                    ref={(instance) => (mapRef.current = instance)}
                >
                    <GeolocateControl />
                    <GeocoderControl mapboxAccessToken={`pk.${mapboxAccessToken}`} position="top-left" viewState={viewState}/>
                    <Marker longitude={viewState.longitude} latitude={viewState.latitude} anchor="bottom" onClick={(evt => onMarkerClick(evt))}/>
                    <NavigationControl position="bottom-right"/>
                </ReactMapGL>
            </div>
        )
    };
} 
export default useCurrentMapLocation;
