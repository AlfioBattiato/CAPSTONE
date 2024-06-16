import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTravel } from '../redux/actions';


export default function SetTravel() {
    const [query, setQuery] = useState('');
    const [metaQuery, setMetaQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [metaSuggestions, setMetaSuggestions] = useState([]);
    const dispatch = useDispatch();
    const travel = useSelector(state => state.infotravels.setTravel);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            axios.get(`/api/proxy/nominatim`, {
                params: {
                    q: value,
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
        } else {
            setSuggestions([]);
        }
    };

    const handleMetaInputChange = (e) => {
        const value = e.target.value;
        setMetaQuery(value);

        if (value.length > 2) {
            axios.get(`/api/proxy/nominatim`, {
                params: {
                    q: value,
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
                    console.error("Error fetching cities: ", error);
                });
        } else {
            setMetaSuggestions([]);
        }
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
        setQuery(suggestion.name);
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
        setMetaQuery('');
        setMetaSuggestions([]);
    };

    return (
        <div className="bg-white p-3 rounded ">
            <p className=' mb-0'>Città di partenza</p>
            <input
                type="text"
                required
                name="city"
                className="form-control rounded-pill "
                placeholder="Città di partenza"
                value={query}
                onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
                <ul className="list-group">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="list-group-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.name} (Lat: {suggestion.lat}, Lon: {suggestion.lon})
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <input
                type="text"
                required
                name="meta"
                className="form-control rounded-pill mt-3"
                placeholder="Aggiungi meta"
                value={metaQuery}
                onChange={handleMetaInputChange}
            />
            {metaSuggestions.length > 0 && (
                <ul className="list-group">
                    {metaSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="list-group-item"
                            onClick={() => handleMetaSuggestionClick(suggestion)}
                        >
                            {suggestion.name} (Lat: {suggestion.lat}, Lon: {suggestion.lon})
                        </li>
                    ))}
                </ul>
            )}

            {travel.metas.length > 0 && (
                <ul className="list-group mt-3 ">
                    {travel.metas.map((meta, index) => (
                        <li key={index} className="list-group-item bg-dark text-white">
                            {meta.city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
