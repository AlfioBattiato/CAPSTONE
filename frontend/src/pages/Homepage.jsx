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
    const [city1, setCity1] = useState({});

    useEffect(() => {
        if (travel.start_location.lat && travel.start_location.lon) {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${travel.start_location.lat}&lon=${travel.start_location.lon}&appid=44f42ddac1ff49b7985b5b7459d5d0e4`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data.list);
                        setCity1(data.list);
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

    // Extract date and time from the startDate
    const extractDateAndTime = (dateTimeString) => {
        const date = dateTimeString.split('T')[0];
        const time = dateTimeString.split('T')[1].split(':').slice(0, 2).join(':');
        return { date, time };
    };

    const { date, time } = travel.startDate ? extractDateAndTime(travel.startDate) : { date: '', time: '' };

    return (
        <div className="container-fluid">
            <Row className='mt-3 pb-5'>
                <Col md={3} className="border-end">
                    <h5 className="mt-2">Organizza il percorso per il tuo viaggio</h5>
                    <SetTravel></SetTravel>
                    <SetTravelSettings></SetTravelSettings>
                </Col>
                <Col md={7}>
                    <h5 className="my-2 pb-2">maps</h5>
                    <Maps></Maps>
                    <All_interest_places></All_interest_places>
                    <hr />
                    <p className='fw-bold text-center'>Ecco le informazioni meteo previste per la tua partenza</p>
                    <div className='my-3 d-flex gap-2 flex-wrap align-items-center justify-content-center'>
                        <Meteo 
                            date={date} 
                            time={time} 
                            name={travel.start_location.city}>
                        </Meteo>
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
