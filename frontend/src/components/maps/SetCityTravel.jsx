import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeMeta, setCurrentTravel } from '../../redux/actions';
import { FaSearchLocation, FaTrash, FaMapMarked, FaMapMarkedAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap';

export default function SetCityTravel() {
    const [formData, setFormData] = useState({
        query: '',
        metaQuery: ''
    });
    const [suggestions, setSuggestions] = useState([]);
    const [metaSuggestions, setMetaSuggestions] = useState([]);
    const [disable, setDisable] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false); // State for showing reset confirmation modal
    const dispatch = useDispatch();
    const travel = useSelector(state => state.infotravels.setTravel);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSuggestionClick = (suggestion) => {
        setDisable(!disable);
        const updatedTravel = {
            ...travel,
            start_location: {
                city: suggestion.name,
                lat: parseFloat(suggestion.lat),
                lon: parseFloat(suggestion.lon)
            }
        };
        dispatch(setCurrentTravel(updatedTravel));
        setFormData({
            ...formData,
            query: suggestion.name
        });
        setSuggestions([]);
    };

    const handleMetaSuggestionClick = (suggestion) => {
        const updatedTravel = {
            ...travel,
            metas: [
                ...travel.metas,
                {
                    city: suggestion.name,
                    lat: parseFloat(suggestion.lat),
                    lon: parseFloat(suggestion.lon)
                }
            ]
        };
        dispatch(setCurrentTravel(updatedTravel));

        setFormData({
            ...formData,
            metaQuery: ''
        });
        setMetaSuggestions([]);
    };

    const handleSubmitCity = (e) => {
        e.preventDefault();

        if (formData.query.length > 2) {
            axios.get(`/api/proxy/nominatim`, {
                params: {
                    q: formData.query,
                }
            })
                .then(response => {
                    // console.log(response.data)
                    const cities = response.data.features.map(city => ({
                        name: city.properties.name,
                        lat: city.geometry.coordinates[1],
                        lon: city.geometry.coordinates[0]
                    }));
                    setSuggestions(cities);
                })
                .catch(error => {
                    console.error("Error fetching cities: ", error);
                });
        }
    };

    const handleSubmitMeta = (e) => {
        e.preventDefault();

        if (formData.metaQuery.length > 2) {
            axios.get(`/api/proxy/nominatim`, {
                params: {
                    q: formData.metaQuery,
                }
            })
                .then(response => {
                    const cities = response.data.features.map(city => ({
                        name: city.properties.name,
                        lat: city.geometry.coordinates[1],
                        lon: city.geometry.coordinates[0]
                    }));
                    setMetaSuggestions(cities);
                })
                .catch(error => {
                    console.error("Error fetching meta cities: ", error);
                });
        }
    };

    const handleRemoveMeta = (index) => {
        dispatch(removeMeta(index));
    };

    const reset = () => {
        setShowResetModal(true); // Show confirmation modal
    };

    const confirmReset = () => {
        const updatedTravel = {
            ...travel,
            metas: [],
            map_instructions:[]
        };
        dispatch(setCurrentTravel(updatedTravel));
        setFormData({
            query: '',
            metaQuery: ''
        });
        setDisable(false);
        setShowResetModal(false); // Close confirmation modal after reset
    };

    const cancelReset = () => {
        setShowResetModal(false); // Close confirmation modal without resetting
    };

    return (
        <div className="bg-white p-3 rounded">
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Conferma azzeramento istruzioni</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Sei sicuro di voler azzerare le istruzioni?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelReset}>
                        Annulla
                    </Button>
                    <Button variant="warning" onClick={confirmReset}>
                        Azzera
                    </Button>
                </Modal.Footer>
            </Modal>

            <form onSubmit={handleSubmitCity}>
                <div className="mb-3">
                    <p className='mb-1 ps-2 fw-bold'>Città di partenza:</p>
                    <div className='input-group align-items-center'>
                        <FaMapMarked className='me-2' />
                        <input
                            type="text"
                            required
                            disabled={disable}
                            name="query"
                            className="form-control rounded-pill"
                            placeholder="Città di partenza"
                            value={formData.query}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="bg-white border-0 ms-2">
                            <FaSearchLocation />
                        </button>
                    </div>
                    {suggestions.length > 0 && (
                        <ul className="list-group  mt-1 ">
                            {suggestions.slice(0, 5).map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="list-group-item rounded"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.name} (Lat: {suggestion.lat}, Lon: {suggestion.lon})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>

            <hr />

            <form onSubmit={handleSubmitMeta}>
                <div className="mb-3">
                    <div className='input-group align-items-center'>
                        <FaMapMarkedAlt className='me-2' />
                        <input
                            type="text"
                            required
                            name="metaQuery"
                            className="form-control rounded-pill"
                            placeholder="Aggiungi meta"
                            value={formData.metaQuery}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="bg-white border-0 ms-2">
                            <FaSearchLocation />
                        </button>
                    </div>
                    {metaSuggestions.length > 0 && (
                        <ul className="list-group mt-1">
                            {metaSuggestions.slice(0, 5).map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="list-group-item rounded"
                                    onClick={() => handleMetaSuggestionClick(suggestion)}
                                >
                                    {suggestion.name} (Lat: {suggestion.lat}, Lon: {suggestion.lon})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>

            {travel.metas.length > 0 && (
                <>
                    {travel.metas.map((meta, index) => (
                        <div key={index} className="d-flex mt-1 align-items-center ps-0 gap-2">
                            <FaMapMarkerAlt className='text-danger' />
                            <li className="list-group-item bg-dark p-2 text-white rounded w-100 overflow-hidden d-flex justify-content-between align-items-center">
                                {meta.city}
                                <button className="btn btn-dark text-danger btn-sm" onClick={() => handleRemoveMeta(index)}>
                                    <FaTrash />
                                </button>
                            </li></div>
                    ))}
                </>
            )}

           <div className="d-flex">
           <button className='btn btn-warning mt-2 ms-auto' onClick={reset}>Azzera istruzioni</button>
           </div>
        </div>
    );
}
