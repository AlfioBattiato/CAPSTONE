import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Switch from 'react-switch';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setActionTravels } from '../redux/actions';
import { format } from 'date-fns';

// Hook per gestire i checkbox
function useCheckboxes(initialState) {
    const [checkboxes, setCheckboxes] = useState(initialState);

    const handleCheckboxChange = (id, checked) => {
        setCheckboxes((prevState) => ({
            ...prevState,
            [id]: checked,
        }));
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
        scooter: false,
        racebikes: false,
        motocross: false,
        offroad: false,
        harley: false,
    });

    const handleCcChange = (value) => {
        setCc(value);
    };

    const handleParticipantsChange = (value) => {
        setParticipants(value);
    };

    const handleDaysChange = (value) => {
        setDays(value);
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
        if (selectedTypes.length > 0) {
            filteredTravels = filteredTravels.filter((travel) => {
                const travelType = travel.type_moto.toLowerCase().replace(' ', '');
                return selectedTypes.includes(travelType);
            });
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
            {Object.keys(checkboxes).map((key) => {
                const label = key === 'racebikes' ? 'Race Bikes' : key === 'offroad' ? 'Off Road' : key.charAt(0).toUpperCase() + key.slice(1);
                return (
                    <div className="form-check" key={key}>
                        <Switch
                            checked={checkboxes[key]}
                            onChange={(checked) => handleCheckboxChange(key, checked)}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={22}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            height={18}
                            width={40}
                            className="react-switch"
                            id={key}
                        />
                        <label className="form-check-label ms-2" htmlFor={key}>{label}</label>
                    </div>
                );
            })}
            <Form.Label className="mt-3 fw-bold">Cilindrata minima</Form.Label>
            <Slider 
                min={0} 
                max={4} 
                step={1} 
                value={cc} 
                onChange={handleCcChange} 
                trackStyle={{ backgroundColor: '#86d3ff' }} 
                handleStyle={{ borderColor: '#2693e6', backgroundColor: '#2693e6' }}
            />
            <p className='mb-0'>Cilindrata: {cc === 0 ? 'Nessun filtro' : `${getCcValue(cc)} cc`}</p>
            <hr />
            <Form.Label className="mt-3 fw-bold">Numero partecipanti</Form.Label>
            <Slider 
                min={0} 
                max={10} 
                step={1} 
                value={participants} 
                onChange={handleParticipantsChange} 
                trackStyle={{ backgroundColor: '#86d3ff' }} 
                handleStyle={{ borderColor: '#2693e6', backgroundColor: '#2693e6' }}
            />
            <p className='mb-0'>Numero partecipanti:</p>
            <div className="fw-bold text-secondary">{participants === 0 ? 'Nessun filtro' : participants}</div>
            <hr />
            <Form.Label className="mt-3 fw-bold">Giorni in viaggio</Form.Label>
            <Slider 
                min={0} 
                max={10} 
                step={1} 
                value={days} 
                onChange={handleDaysChange} 
                trackStyle={{ backgroundColor: '#86d3ff' }} 
                handleStyle={{ borderColor: '#2693e6', backgroundColor: '#2693e6' }}
            />
            <p className='mb-0'>Giorni in viaggio:</p>
            <div className="fw-bold text-secondary">{days === 0 ? 'Nessun filtro' : days}</div>
        </div>
    );
}
