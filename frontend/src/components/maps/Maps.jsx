import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import RoutingMachine from './RoutingMachine';
import { setCurrentTravel, setFormData } from '../../redux/actions';
import InfoPlace from '../interest_places/InfoPlace'; // Importa InfoPlace

// Importa le icone personalizzate
import startIconUrl from '/assets/maps/ico1.gif';
import arriveIconUrl from '/assets/maps/blue.png';
import singolarmetaIconUrl from '/assets/maps/ico20.png';
import interestUrl from '/assets/maps/ico23.png';

export default function Maps() {
    const travel = useSelector(state => state.infotravels.setTravel);
    const interestplaces = useSelector(state => state.infotravels.interestPlaces);
    const metas = useSelector(state => state.infotravels.metas);
    const dispatch = useDispatch();
    const [position, setPosition] = useState([41.8933203, 12.4829321]); // Coordinate predefinite
    const [popupInfo, setPopupInfo] = useState(null); // Informazioni per il popup
    const [key, setKey] = useState(metas.length); // Informazioni per il popup
    const [selectedPlace, setSelectedPlace] = useState(null); // State per gestire il place selezionato

    useEffect(() => {
        // Ottieni la posizione dell'utente al caricamento della mappa
        navigator.geolocation.getCurrentPosition(
            (geoLocation) => {
                const { latitude, longitude } = geoLocation.coords;
                setPosition([latitude, longitude]);
                setPopupInfo({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error('Error getting user location:', error);
            }
        );

        setKey(oldKey => oldKey + 1); // Aggiorna la chiave per forzare il re-render dei marker
    }, []);

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
    };

    function ClickableMap() {
        useMapEvents({
            click: handleClickOnMap,
        });
        return null; // Nessun componente visivo, solo gestione eventi
    }

    // Crea le icone personalizzate per i marker
    const startIcon = new L.Icon({
        iconUrl: startIconUrl,
        iconSize: [40, 40],
        iconAnchor: [18, 30],
        popupAnchor: [0, -40],
        className: 'custom-start-icon'
    });

    const arriveIcon = new L.Icon({
        iconUrl: arriveIconUrl,
        iconSize: [40, 40],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        className: 'custom-arrive-icon'
    });

    const metaIcon = new L.Icon({
        iconUrl: singolarmetaIconUrl,
        iconSize: [40, 40],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        className: 'custom-meta-icon'
    });

    const interestIcon = new L.Icon({
        iconUrl: interestUrl,
        iconSize: [40, 40],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        className: 'custom-interest-icon'
    });

    // Gestore del click su un marker di interest place
    const handleInterestPlaceClick = (place) => {
        setSelectedPlace(place);
    };

    return (
        <div className='shadow rounded-25'>
            <MapContainer center={position} zoom={13} style={{ height: '38.6rem', width: '100%', borderRadius: '25px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ClickableMap />

                {interestplaces && interestplaces.length > 0 && interestplaces.map((place, index) => (
                    <Marker key={index} position={[place.lat, place.lon]} icon={interestIcon}>
                        <Popup>
                            <div>
                                <p>Località: {place.name_location ? place.name_location : "Sconosciuto"}</p>
                                <img
                                    className='img-fluid cursor'
                                    src={place.location_img}
                                    alt="img"
                                    onClick={() => handleInterestPlaceClick(place)} // Gestione del click sull'immagine
                                />
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {travel.start_location.city && travel.start_location.lat && travel.start_location.lon && (
                    <Marker position={[travel.start_location.lat, travel.start_location.lon]} icon={startIcon}>
                        <Popup>Start Location: {travel.start_location.city}</Popup>
                    </Marker>
                )}

                {metas.map((meta, index) => (
                    <Marker
                        key={index}
                        position={[meta.lat, meta.lon]}
                        icon={index === metas.length - 1 ? arriveIcon : metaIcon}
                    >
                        <Popup>Meta: {meta.city}</Popup>
                    </Marker>
                ))}

                {popupInfo && (
                    <Marker position={[popupInfo.lat, popupInfo.lng]} icon={startIcon}>
                        <Popup>
                            Latitude: {popupInfo.lat}, Longitude: {popupInfo.lng}
                        </Popup>
                    </Marker>
                )}

                {/* Mostra InfoPlace se un place è stato selezionato */}
                {selectedPlace && (
                    <InfoPlace
                        show={true}
                        handleClose={() => setSelectedPlace(null)}
                        place={selectedPlace}
                    />
                )}

                {/* Mostra la routing machine se ci sono metas e la posizione iniziale è diversa da zero */}
                {travel.start_location.lat !== 0 && metas.length > 0 && (
                    <RoutingMachine
                        key={key}
                        lat={travel.start_location.lat}
                        lon={travel.start_location.lon}
                        metas={metas}
                        dispatch={dispatch}
                    />
                )}
            </MapContainer>
        </div>
    );
}
