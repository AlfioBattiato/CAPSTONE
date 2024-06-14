import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setActionTravels } from '../redux/actions';
import { format } from 'date-fns';

// Hook per gestire i checkbox
function useCheckboxes(initialState) {
    const [checkboxes, setCheckboxes] = useState(initialState);

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setCheckboxes((prevState) => ({
            ...prevState,
            [id]: checked,
        }));
    };
    dispatch(setFilters(newFilters));
  };

    return [checkboxes, handleCheckboxChange];
}

export default function FilterTravel({ setTravels }) {
    const alltravel = useSelector((state) => state.infotravels.travels);
    const dispatch = useDispatch();

    useEffect(() => {
        axios('api/v1/travels')
            .then((res) => {
                dispatch(setActionTravels(res.data));
                setTravels(res.data);
            })
            .catch((error) => {
                console.error('Error fetching travels:', error);
            });
    }, [dispatch, setTravels]);

    const [city, setCity] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [cc, setCc] = useState(0);
    const [participants, setParticipants] = useState(0);
    const [days, setDays] = useState(0);

    const [checkboxes, handleCheckboxChange] = useCheckboxes({
        scooter: true,
        race_bikes: true,
        motocross: true,
        off_road: true,
        harley: true,
    });

    const handleCcChange = (e) => {
        setCc(parseInt(e.target.value, 10));
    };

    const handleParticipantsChange = (e) => {
        setParticipants(parseInt(e.target.value, 10));
    };

    const handleDaysChange = (e) => {
        setDays(parseInt(e.target.value, 10));
    };

    const getCcValue = (step) => {
        switch (step) {
            case 0: return null;
            case 1: return 150;
            case 2: return 300;
            case 3: return 600;
            case 4: return 1200;
            default: return null;
        }
    };

    useEffect(() => {
        let filteredTravels = [...alltravel];

        if (city) {
            filteredTravels = filteredTravels.filter((travel) => travel.start_location.toUpperCase().startsWith(city.toUpperCase()));
        }

        if (startDate) {
            const formattedDate = format(startDate, 'yyyy-MM-dd');
            filteredTravels = filteredTravels.filter((travel) => travel.departure_date === formattedDate);
        }

        if (getCcValue(cc) !== null) {
            filteredTravels = filteredTravels.filter((travel) => travel.cc_moto === getCcValue(cc));
        }

        if (participants > 0) {
            filteredTravels = filteredTravels.filter((travel) => travel.users.length === participants || travel.users.length > 10);
        }

        const selectedTypes = Object.keys(checkboxes).filter(key => checkboxes[key]);
        if (selectedTypes.length > 0 && selectedTypes.length < Object.keys(checkboxes).length) {
            filteredTravels = filteredTravels.filter((travel) => selectedTypes.includes(travel.type_moto));
        }

        if (days > 0) {
            filteredTravels = filteredTravels.filter((travel) => {
                const departureDate = new Date(travel.departure_date);
                const expirationDate = new Date(travel.expiration_date);
                const travelDays = Math.ceil((expirationDate - departureDate) / (1000 * 60 * 60 * 24));
                return travelDays === days;
            });
        }

        setTravels(filteredTravels);

    }, [city, startDate, cc, participants, checkboxes, days, alltravel, setTravels]);

    return (
        <div className="mt-2">
            <input
                type="text"
                required
                name="city"
                className="form-control"
                placeholder="Città di partenza"
                onChange={(e) => setCity(e.target.value.toUpperCase())}
            />
            <hr />
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText='Data di partenza'
            />
            <hr />
            {Object.keys(checkboxes).map((key) => (
                <div className="form-check" key={key}>
                    <input
                        checked={checkboxes[key]}
                        className="form-check-input"
                        type="checkbox"
                        id={key}
                        onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor={key}>{key}</label>
                </div>
            ))}
            <Form.Label className="mt-3 fw-bold">Cilindrata minima</Form.Label>
            <Form.Range min={0} max={4} step={1} value={cc} onChange={handleCcChange} />
            <p className='mb-0'>Cilindrata: {cc === 0 ? 'Nessun filtro' : `${getCcValue(cc)} cc`}</p>
            <hr />
            <Form.Label className="mt-3 fw-bold">Numero partecipanti</Form.Label>
            <Form.Range min={0} max={10} step={1} value={participants} onChange={handleParticipantsChange} />
            <p className='mb-0'>Numero partecipanti:</p>
            <div className="fw-bold text-secondary">{participants === 0 ? 'Nessun filtro' : participants}</div>
            <hr />
            <Form.Label className="mt-3 fw-bold">Giorni in viaggio</Form.Label>
            <Form.Range min={0} max={10} step={1} value={days} onChange={handleDaysChange} />
            <p className='mb-0'>Giorni in viaggio:</p>
            <div className="fw-bold text-secondary">{days === 0 ? 'Nessun filtro' : days}</div>
        </div>
    );
}
