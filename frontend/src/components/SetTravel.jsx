import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeMeta, setCurrentTravel } from '../redux/actions';
import { FaSearchLocation, FaTrash } from "react-icons/fa";

export default function SetTravel() {
    const [formData, setFormData] = useState({
        query: '',
        metaQuery: ''
    });
    const [suggestions, setSuggestions] = useState([]);
    const [metaSuggestions, setMetaSuggestions] = useState([]);
    const dispatch = useDispatch();
    const travel = useSelector(state => state.infotravels.setTravel);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSuggestionClick = (suggestion) => {
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
                    console.log(response)
                    const cities = response.data.map(city => ({
                        name: city.display_name,
                        lat: city.lat,
                        lon: city.lon
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
                    const cities = response.data.map(city => ({
                        name: city.display_name,
                        lat: city.lat,
                        lon: city.lon
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

    return (
        <div className="bg-white p-3 rounded">
            <form onSubmit={handleSubmitCity}>
                <div className="mb-3">
                    <p className='text-center mb-0'>Città di partenza</p>
                    <div className='input-group'>
                        <input
                            type="text"
                            required
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
                            {suggestions.map((suggestion, index) => (
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
                    <div className='input-group'>
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
                            {metaSuggestions.map((suggestion, index) => (
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
                <ul className="list-group mt-3">
                    {travel.metas.map((meta, index) => (
                        <li key={index} className="list-group-item bg-dark text-white rounded d-flex justify-content-between align-items-center">
                            {meta.city}
                            <button className="btn btn-danger btn-sm" onClick={() => handleRemoveMeta(index)}>
                                <FaTrash />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
