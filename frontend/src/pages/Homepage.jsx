import { Col, Row } from 'react-bootstrap';
import SetTravel from '../components/maps/SetCityTravel';
import Maps from '../components/maps/Maps';
import SetTravelSettings from '../components/maps/SetTravelSettings';
import RouteInstructions from '../components/maps/RouteInstructions ';
import All_interest_places from '../components/interest_places/All_interest_places';
import Meteo from '../components/meteo';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Homepage() {
    const travel = useSelector((state) => state.infotravels.setTravel);
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        if (travel.start_location.lat && travel.start_location.lon) {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${travel.start_location.lat}&lon=${travel.start_location.lon}&appid=44f42ddac1ff49b7985b5b7459d5d0e4`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setWeatherData(data.list);
                    } else {
                        throw new Error("Problema nella chiamata API");
                    }
                } catch (error) {
                    console.error("Errore durante il recupero dei dati:", error);
                }
            };

            fetchData();
        }
    }, [travel]);

    const renderMeteo = (data, index) => (
        <Meteo
            key={index}
            date={data.dt_txt}
            img={data.weather[0].icon}
            name={travel.start_location.city}
            min={(data.main.temp_min - 273.15).toFixed(1)}
            max={(data.main.temp_max - 273.15).toFixed(1)}
            temp={(data.main.temp - 273.15).toFixed(1)}
        />
    );

    return (
        <div className="container-fluid">
            <Row className='mt-3 pb-5'>
                <Col md={3} className="border-end">
                    <h5 className="mt-2">Organizza il percorso per il tuo viaggio</h5>
                    <SetTravel />
                    <SetTravelSettings />
                </Col>
                <Col md={7}>
                    <h5 className="my-2 pb-2">maps</h5>
                    <Maps />
                    <All_interest_places />
                    <hr />
                    <p className='fw-bold text-center'>Ecco le informazioni meteo previste tra oggi e i prossimi 5 giorni</p>
                    <div className='my-3 d-flex gap-2 flex-wrap align-items-center justify-content-center'>
                        {weatherData.slice(0, 33).filter((_, index) => index % 8 === 0).map(renderMeteo)}
                    </div>
                </Col>
                <Col md={2} className="border-start">
                    <RouteInstructions />
                </Col>
            </Row>
        </div>
    );
}

export default Homepage;
