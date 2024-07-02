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

    // State per gestire il place selezionato
    const [selectedPlace, setSelectedPlace] = useState(null);

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
    }, [travel, metas]);

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

    // Crea l'icona personalizzata per la start location
    const startIcon = new L.Icon({
        iconUrl: startIconUrl,
        iconSize: [40, 40], // Dimensione dell'icona
        iconAnchor: [18, 30], // Punto dell'icona che corrisponderà alla posizione
        popupAnchor: [0, -40], // Punto del popup che corrisponderà alla posizione
        className: 'custom-start-icon' // Aggiungi una classe personalizzata se necessario
    });

    // Crea l'icona personalizzata per l'ultima meta (arrivo)
    const arriveIcon = new L.Icon({
        iconUrl: arriveIconUrl,
        iconSize: [40, 40], // Dimensione dell'icona
        iconAnchor: [15, 30], // Punto dell'icona che corrisponderà alla posizione
        popupAnchor: [0, -30], // Punto del popup che corrisponderà alla posizione
        className: 'custom-arrive-icon' // Aggiungi una classe personalizzata se necessario
    });

    // Crea l'icona personalizzata per le singole mete
    const metaIcon = new L.Icon({
        iconUrl: singolarmetaIconUrl,
        iconSize: [40, 40], // Dimensione dell'icona
        iconAnchor: [15, 30], // Punto dell'icona che corrisponderà alla posizione
        popupAnchor: [0, -30], // Punto del popup che corrisponderà alla posizione
        className: 'custom-meta-icon' // Aggiungi una classe personalizzata se necessario
    });

    // Crea l'icona personalizzata per gli interest places
    const interestIcon = new L.Icon({
        iconUrl: interestUrl,
        iconSize: [40, 40], // Dimensione dell'icona
        iconAnchor: [15, 30], // Punto dell'icona che corrisponderà alla posizione
        popupAnchor: [0, -30], // Punto del popup che corrisponderà alla posizione
        className: 'custom-interest-icon' // Aggiungi una classe personalizzata se necessario
    });

    // Gestore del click su un marker di interest place
    const handleInterestPlaceClick = (place) => {
        setSelectedPlace(place);
    };

    return (
        <div className='shadow rounded-25'>
            <MapContainer center={position} zoom={5} style={{ height: '38.6rem', width: '100%', borderRadius: '25px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    className="black-and-white" // Aggiungi la classe CSS per il filtro in bianco e nero
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

                {metas.map((meta, index) => {
                    const isLastMeta = index === metas.length - 1;
                    return (
                        <Marker
                            key={index}
                            position={[meta.lat, meta.lon]}
                            icon={isLastMeta ? arriveIcon : metaIcon}
                        >
                            <Popup>Meta: {meta.city}</Popup>
                        </Marker>
                    );
                })}

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
                        show={true} // Mostra InfoPlace
                        handleClose={() => setSelectedPlace(null)} // Chiudi InfoPlace
                        place={selectedPlace} // Passa il place selezionato
                    />
                )}

                {travel.start_location.lat !== 0 && metas.length > 0 && (
                    <RoutingMachine
                        key={key} // Usare key per forzare il render di una nuova istanza di RoutingMachine
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