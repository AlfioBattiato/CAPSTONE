import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default function Maps() {
    const travel = useSelector(state => state.infotravels.setTravel);
    const [position, setPosition] = useState([41.8933203, 12.4829321]); // Coordinate predefinite
    const [route, setRoute] = useState(null);

    useEffect(() => {
        // Ottieni la posizione dell'utente utilizzando la geolocalizzazione del browser
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            }, (error) => {
                console.error("Error getting geolocation:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        // Quando cambia il viaggio, aggiorna la posizione della mappa alla posizione di partenza
        if (travel.start_location.lat && travel.start_location.lon) {
            setPosition([travel.start_location.lat, travel.start_location.lon]);
        }

        // Calcola il percorso tra i punti del viaggio
        if (travel.start_location && travel.metas.length > 0) {
            const waypoints = [
                [travel.start_location.lat, travel.start_location.lon],
                ...travel.metas.map(meta => [meta.lat, meta.lon])
            ];

            const coordinates = waypoints.map(coord => coord.join(',')).join(';');
            const osrmUrl = `/osrm-api/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

            axios.get(osrmUrl)
                .then(response => {
                    console.log('Route response:', response.data); // Log della risposta
                    if (response.data.routes && response.data.routes.length > 0) {
                        console.log(response.data.routes[0].geometry.coordinates)
                        const routeCoordinates = response.data.routes[0].geometry.coordinates.map(coord => [coord[0], coord[1]]);
                        setRoute(routeCoordinates);
                    } else {
                        console.error('No routes found in response:', response.data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching route:", error);
                });
        }
    }, [travel]);

    const startLocation = travel.start_location;
    const metas = travel.metas;

    return (
        <MapContainer center={position} zoom={8} style={{ height: "30rem", width: "100%" }}>
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
            {route && route.length > 0 && (
                <Polyline positions={route} color="blue" />
            )}
        </MapContainer>
    );
}
