import React from 'react';
import './Meteo.css';
import { Card, Col } from 'react-bootstrap';

// Importa le icone SVG
import sunnyIcon from '/assets/meteo/day_clear.png';
import cloud from '/assets/meteo/cloudy.png';
import cloudlightning from '/assets/meteo/rain_thunder.png';
import rain from '/assets/meteo/rain.png';
import snow from '/assets/meteo/snow.png';
import fog from '/assets/meteo/fog.png';
import day_partial_cloud from '/assets/meteo/day_partial_cloud.png';
import night_half_moon_rain from '/assets/meteo/night_half_moon_rain.png';
import night_half_moon_clear from '/assets/meteo/night_half_moon_clear.png';

// Aggiungi altre icone meteorologiche come necessario

export default function Meteo({ name, date, temp, min, max, img, humidity }) {

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const getWeatherIcon = (img) => {
        switch (img) {
            case '01d':
                return sunnyIcon;
            case '01n':
                return night_half_moon_clear;
            case '02d':
            case '02n':
                return day_partial_cloud;
            case '03d':
            case '03n':
            case '04d':
            case '04n':
                return cloud;
            case '09d':
            case '09n':
            case '10d':
                return rain;
            case '10n':
                return night_half_moon_rain;
            case '11d':
            case '11n':
                return cloudlightning;
            case '13d':
            case '13n':
                return snow;
            case '50d':
            case '50n':
                return fog;
            // Aggiungi altri casi per altre condizioni meteorologiche
            default:
                return null; // Gestione di default nel caso in cui non ci sia un'icona corrispondente
        }
    };

    return (
        <Col className="mb-3">
            <Card className="meteo-card">
                <Card.Body className='p-1'>
                    <div className="weather-icon">
                        {img && <img src={getWeatherIcon(img)} alt="Weather Icon" className='img-fluid' />}
                    </div>
                    <div className="weather-info ms-3 text-center">
                        <div className="weather-date">{date ? formatDate(date) : "Nessuna data impostata"}</div>
                        <div className="weather-temp">{temp} °C</div>
                        <div className="weather-city">{name ? name : "Nessuna città impostata"}</div>
                    </div>
                </Card.Body>
                    <hr />
                <div className="text-center meteoinfo p-2">
                    <div>Umidità: {humidity}%</div>
                    <div className="d-flex justify-content-center mt-2">
                        <div className="me-2">Min: {min}°C</div>
                        <div>Max: {max}°C</div>
                    </div>
                </div>
            </Card>
        </Col>
    );
}

