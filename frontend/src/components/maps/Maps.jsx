import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

import RoutingMachine from './RoutingMachine';
// import RouteInstructions from './RouteInstructions ';

export default function Maps() {
    const travel = useSelector(state => state.infotravels.setTravel);
    const [position, setPosition] = useState([41.8933203, 12.4829321]); // Coordinate predefinite
    const [metas, setMetas] = useState(travel.metas);
    // const [routeInstructions, setRouteInstructions] = useState([]);
    const dispatch=useDispatch()

    useEffect(() => {
        setPosition([travel.start_location.lat, travel.start_location.lon]);
        setMetas(travel.metas);
    }, [travel]);

    const startLocation = travel.start_location;

    return (
        <div>
            <MapContainer center={position} zoom={10} style={{ height: '30rem', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {startLocation.lat && startLocation.lon && (
                    <Marker position={[startLocation.lat, startLocation.lon]}>
                        <Popup>Start Location: {startLocation.city}</Popup>
                    </Marker>
                )}
                {metas.map((meta, index) => (
                    <Marker key={index} position={[meta.lat, meta.lon]}>
                        <Popup>Meta: {meta.city}</Popup>
                    </Marker>
                ))}
                {startLocation && startLocation.lat !== 0 && metas && metas.length > 0 && (
                    <RoutingMachine
                        key={metas.length}
                         start_location={startLocation} 
                         metas={metas} 
                        //  setRoute={setRouteInstructions}
                         dispatch={dispatch}
                         travel={travel}
                         />
                )}
            </MapContainer>
            {/* <RouteInstructions instructions={routeInstructions} /> */}
        </div>
    );
}
