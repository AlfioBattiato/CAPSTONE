import React, { useState } from 'react';
import axios from 'axios';

function Homepage() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            // Chiamata all'API di Nominatim
            axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: value,
                    format: 'json',
                    addressdetails: 1,
                    limit: 10,
                }
            })
            .then(response => {
                console.log(response)
                const cities = response.data.map(city => ({
                    name: city.display_name,
                    lat: city.lat,
                    lng: city.lon
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

    return (
        <div className="container">
            <p className="mt-3">Organizza il percorso per il tuo viaggio </p>
            <input
                type="text"
                required
                name="city"
                className="form-control rounded-pill"
                placeholder="Città di partenza"
                value={query}
                onChange={handleInputChange}
                style={{ width: '15rem' }}
            />
            {suggestions.length > 0 && (
                <ul className="list-group">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="list-group-item">
                            {suggestion.name} (Lat: {suggestion.lat}, Lng: {suggestion.lng})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Homepage;
