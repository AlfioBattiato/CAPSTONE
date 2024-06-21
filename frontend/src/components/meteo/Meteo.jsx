import React from 'react'
import './Meteo.css'
import { useSelector } from 'react-redux';

export default function Meteo({ name, date, temp, min, max, img }) {


    return (
        <div className="cardContainer">
            <div className="card1">
                <p className="city mb-0">{name ? name : "Nessuna città impostata"}</p>

                <p className="weather">{date ? date : "Nessuna data impostata"}</p>
                <img
                    src={`http://openweathermap.org/img/wn/${img}.png`}
                    style={{ width: "2.5rem" }}
                    alt="weather icon"
                    className="weatherIcon"
                />
                <p className="temp">{temp}°</p>
                <div className="minmaxContainer">
                    <div className="min">
                        <p className="minHeading">Min</p>
                        <p className="minTemp">{min}°</p>
                    </div>
                    <div className="max">
                        <p className="maxHeading">Max</p>
                        <p className="maxTemp">{max}°</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
