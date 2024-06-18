import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import RoutingMachine from './RoutingMachine';
import { setCurrentTravel } from '../../redux/actions';

export default function Maps() {
    const travel = useSelector(state => state.infotravels.setTravel);
    const [position, setPosition] = useState([41.8933203, 12.4829321]); // Coordinate predefinite
    const [metas, setMetas] = useState(travel.metas);
    const [popupInfo, setPopupInfo] = useState(null); // Informazioni per il popup
    const [key, setKey] = useState(metas.length); // Informazioni per il popup
    const dispatch = useDispatch();

    // setta il punto di partenza con il punto da te cliccato
    useEffect(() => {
        setPosition([travel.start_location.lat, travel.start_location.lon]);
        setMetas(travel.metas);
     
        console.log('ok')
    }, [travel]);
    
    useEffect(() => {
        setKey((oldkey)=>{
            return oldkey+1
        })
    }, [metas]);

    const startLocation = travel.start_location;

    // Gestore per il click sulla mappa
    const handleClickOnMap = (event) => {
        const input=document.getElementById('city-input-setting')
        const { lat, lng } = event.latlng;
        const updatedTravel = {
            ...travel,
            start_location: {
                city: "Punto interattivo",
                lat: parseFloat(lat),
                lon: parseFloat(lng)
            }
        };
        dispatch(setCurrentTravel(updatedTravel));

        setPopupInfo({ lat, lng });
        setKey((oldkey)=>{
            return oldkey+1
        })


        if (input) {
            input.value = "Punto interattivo";
            input.disabled = true; // Disabilitare l'input
        }
    };

    // Componente per gestire eventi di click sulla mappa
    function ClickableMap() {
        const map = useMapEvents({
            click: handleClickOnMap,
        });
        return null; // No visual component, just handling events
    }

    return (
        <div className=''>
            <MapContainer center={position} zoom={10} style={{ height: '30rem', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Aggiungiamo il componente per gestire il click sulla mappa */}
                <ClickableMap />

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

                {/* Mostra il popup se popupInfo è definito */}
                {popupInfo && (
                    <Marker position={[popupInfo.lat, popupInfo.lng]}>
                        <Popup>
                            Latitude: {popupInfo.lat}, Longitude: {popupInfo.lng}
                        </Popup>
                    </Marker>
                )}

                {startLocation && startLocation.lat !== 0 && metas && metas.length > 0 && (
                    <RoutingMachine
                        key={key}
                        start_location={startLocation}
                        metas={metas}
                        dispatch={dispatch}
                        travel={travel}
                    />
                )}
            </MapContainer>
        </div>
    );
}
