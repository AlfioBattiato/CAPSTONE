import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function Maps() {
    const travel = useSelector(state => state.infotravels.setTravel);
    const [position, setPosition] = useState([41.8933203, 12.4829321]); // Coordinate predefinite

    useEffect(() => {
        if (navigator.geolocation) {
            console.log(navigator.geolocation)
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, [travel]);

    useEffect(() => {
        console.log('change')
        if (travel.start_location.lat && travel.start_location.lon) {
            setPosition([travel.start_location.lat, travel.start_location.lon]);
        }
    }, [travel]);

    const startLocation = travel.start_location;
    const metas = travel.metas;

    const pathCoordinates = [
        [startLocation.lat, startLocation.lon],
        ...metas.map(meta => [meta.lat, meta.lon])
    ];

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
            <Polyline positions={pathCoordinates} color="blue" />
        </MapContainer>
    );
}
