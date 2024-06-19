import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import RoutingMachine from './RoutingMachine';
import { setCurrentTravel, setFormData } from '../../redux/actions';

export default function Maps() {
    const travel = useSelector(state => state.infotravels.setTravel);
    const [position, setPosition] = useState([41.8933203, 12.4829321]); // Coordinate predefinite
    const [popupInfo, setPopupInfo] = useState(null); // Informazioni per il popup
    const [key, setKey] = useState(travel.metas.length); // Informazioni per il popup
    const dispatch = useDispatch();

    useEffect(() => {
        if (travel.start_location.lat && travel.start_location.lon) {
            setPosition([travel.start_location.lat, travel.start_location.lon]);
        }

        if (travel.start_location.city) {
            setPopupInfo({ lat: travel.start_location.lat, lng: travel.start_location.lon });
        } else {
            setPopupInfo(null);
        }
        setKey(oldKey => oldKey + 1);
    }, [travel]);

    const handleClickOnMap = (event) => {
        const { lat, lng } = event.latlng;
        const updatedTravel = {
            ...travel,
            start_location: {
                city: "Punto interattivo",
                lat: parseFloat(lat),
                lon: parseFloat(lng)
            },
        };
        const formDataUpdate = {
            query: 'Punto interattivo',
            metaQuery: ''
        };
        dispatch(setFormData(formDataUpdate));
        dispatch(setCurrentTravel(updatedTravel));
      

        setPopupInfo({ lat, lng });
        setKey(oldKey => oldKey + 1);
    };

    function ClickableMap() {
        useMapEvents({
            click: handleClickOnMap,
        });
        return null; // Nessun componente visivo, solo gestione eventi
    }

    return (
        <div>
            <MapContainer center={position} zoom={10} style={{ height: '40rem', width: '100%', borderRadius: '25px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ClickableMap />

                {travel.start_location.city && travel.start_location.lat && travel.start_location.lon && (
                    <Marker position={[travel.start_location.lat, travel.start_location.lon]}>
                        <Popup>Start Location: {travel.start_location.city}</Popup>
                    </Marker>
                )}

                {travel.metas.map((meta, index) => (
                    <Marker key={index} position={[meta.lat, meta.lon]}>
                        <Popup>Meta: {meta.city}</Popup>
                    </Marker>
                ))}

                {popupInfo && (
                    <Marker position={[popupInfo.lat, popupInfo.lng]}>
                        <Popup>
                            Latitude: {popupInfo.lat}, Longitude: {popupInfo.lng}
                        </Popup>
                    </Marker>
                )}

                {travel.start_location.lat !== 0 && travel.metas.length > 0 && (
                    <RoutingMachine
                        key={key}
                        start_location={travel.start_location}
                        metas={travel.metas}
                        dispatch={dispatch}
                       
                    />
                )}
            </MapContainer>
        </div>
    );
}
