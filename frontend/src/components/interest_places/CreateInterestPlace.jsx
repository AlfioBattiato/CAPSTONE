import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';

export default function CreateInterestPlace() {
    const [position, setPosition] = useState([41.8933203, 12.4829321]); // Coordinate predefinite
    const [popupInfo, setPopupInfo] = useState(null);
    const [formData, setFormData] = useState({
        name_location: '',
        description: '',
        location_img: ''
    });
    const dispatch = useDispatch();

    function ClickableMap() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPopupInfo({ lat, lng });
                setPosition([lat, lng]);
            },
        });
        return null;
    }

    const updateInputValue = (ev) => {
        const { name, value } = ev.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (ev) => {
        const { name, files } = ev.target;
        setFormData({
            ...formData,
            [name]: files[0]
        });
    };

    const submitForm = (ev) => {
        ev.preventDefault();
        axios.get('/sanctum/csrf-cookie')
            .then(() => {
                const body = new FormData();
                body.append('name_location', formData.name_location);
                body.append('description', formData.description);
                body.append('location_img', formData.location_img);
                body.append('lat', popupInfo.lat);
                body.append('lon', popupInfo.lng);

                return axios.post('/api/interest-places', body);
            })
            .then((response) => {
                console.log('Place created successfully:', response.data);
                // Dispatch success action if needed
                axios('/api/interest-places')
            })
            .catch((error) => {
                console.error('Error creating place:', error);
            });
    };

    return (
        <div className='container mt-3'>
            <p className='fw-bold'>Inserisci un nuovo punto di interesse</p>
            <Row>
                <Col xs={12} md={6}>
                    <div className="rounded bg-white p-3 mb-2">
                        <p className='fw-bold'>Istruzioni:</p>
                        <ul>
                            <li>Clicca sulla mappa il punto dove si trova il tuo suggerrimento</li>
                            <li>Se conosci il nome del luogo, inseriscilo per identificarlo correttamente</li>
                            <li>Aggiungi delle brevi note aggiuntive, ad esempio dettagli particolari sul percorso, come strade non accessibili a tutti,
                                per aiutare gli altri motociclisti a comprendere meglio il luogo.</li>
                        </ul>


                        <p className='text-success'>Grazie per il tuo contributo</p>
                    </div>
                    <form onSubmit={submitForm} noValidate className='rounded bg-white p-3'>
                        <div className="mb-3">
                            <label htmlFor="name_location" className="form-label">Nome luogo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name_location"
                                name="name_location"
                                onChange={updateInputValue}
                                value={formData.name_location}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Note aggiuntive</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                onChange={updateInputValue}
                                value={formData.description}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="location_img" className="form-label">Immagine</label>
                            <input
                                type="file"
                                className="form-control"
                                id="location_img"
                                name="location_img"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Invia</button>
                    </form>

                </Col>
                {/* ******************************************** */}
                <Col xs={12} md={6}>

                    <MapContainer center={position} zoom={10} style={{ height: '40rem', width: '100%', borderRadius: '25px' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <ClickableMap />
                        {popupInfo && (
                            <Marker position={[popupInfo.lat, popupInfo.lng]}>
                                <Popup>
                                    Latitude: {popupInfo.lat}, Longitude: {popupInfo.lng}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </Col>
            </Row>




        </div>
    );
}
