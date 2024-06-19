import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeMeta, setCurrentTravel } from '../../redux/actions';
import { FaSearchLocation, FaTrash, FaMapMarked, FaMapMarkedAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap';

export default function SetCityTravel() {
    const [suggestions, setSuggestions] = useState([]);
    const [metaSuggestions, setMetaSuggestions] = useState([]);
    const [showResetModal, setShowResetModal] = useState(false); // State for showing reset confirmation modal
    const dispatch = useDispatch();
    const travel = useSelector(state => state.infotravels.setTravel);
    const { query, metaQuery } = travel.formData;


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Update formData in travel directly
        const updatedTravel = {
            ...travel,
            formData: {
                ...travel.formData,
                [name]: value
            },
        };
        dispatch(setCurrentTravel(updatedTravel))
    };

    const handleSuggestionClick = (suggestion) => {

        const updatedTravel = {
            ...travel,
            start_location: {
                city: suggestion.name,
                lat: parseFloat(suggestion.lat),
                lon: parseFloat(suggestion.lon)
            },
            formData: {
                ...travel.formData,
                query: suggestion.name
            },
            inputDisable: true
        };
        dispatch(setCurrentTravel(updatedTravel));
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
            ],
            formData: {
                ...travel.formData,
                metaQuery: ''
            }
        };
        dispatch(setCurrentTravel(updatedTravel));


        setMetaSuggestions([]);
    };

    const handleSubmitCity = (e) => {
        e.preventDefault();

        if (query.length > 2) {
            axios.get(`/api/proxy/nominatim`, {
                params: {
                    q: query,
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

        if (metaQuery.length > 2) {
            axios.get(`/api/proxy/nominatim`, {
                params: {
                    q: metaQuery,
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
            start_location: {
                city: '',
                lat: 0,
                lon: 0,
            },
            metas: [],
            map_instructions: [],
            formData: {
                query: '',
                metaQuery: ''
            },
            inputDisable: false

        };
        dispatch(setCurrentTravel(updatedTravel));
        setShowResetModal(false); // Close confirmation modal after reset
    };

    const cancelReset = () => {
        setShowResetModal(false); // Close confirmation modal without resetting
    };

    return (
        <div className="bg-white p-3 rounded bg-dark">
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
                            disabled={travel.inputDisable}
                            name="query"
                            className="form-control rounded-pill"
                            id='city-input-setting'
                            placeholder="Città di partenza"
                            value={query}
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
                            value={metaQuery}
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

            <div className="d-flex ">
                <button className="Btn  mt-2 ms-auto" onClick={reset}>
                    <div className="sign">
                        <svg
                            viewBox="0 0 16 16"
                            className="bi bi-trash3-fill"
                            fill="currentColor"
                            height="18"
                            width="18"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                            ></path>
                        </svg>
                    </div>

                    <div className="text">Annulla</div>
                </button>
                {/* <button className='btn btn-warning mt-2 ms-auto' onClick={reset}>Annulla</button> */}
            </div>

        </div>
    );
}
