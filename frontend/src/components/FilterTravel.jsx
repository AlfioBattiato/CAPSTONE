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
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


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
    const alltravel = useSelector((state) => state.infotravels.alltravels);
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
    const [participants, setParticipants] = useState(0);
    const [days, setDays] = useState(0);

    const [checkboxes, handleCheckboxChange] = useCheckboxes({
        scooter: false,
        racebikes: false,
        motocross: false,
        offroad: false,
        harley: false,
    });

    const [checkboxes2, handleCheckboxChange2] = useCheckboxes({
        150: false,
        300: false,
        600: false,
        1200: false,
    });

    useEffect(() => {
        let filteredTravels = [...alltravel];

        if (city) {
            filteredTravels = filteredTravels.filter((travel) => travel.start_location.toUpperCase().startsWith(city.toUpperCase()));
        }

        if (startDate) {
            const formattedDate = format(startDate, 'yyyy-MM-dd');
            filteredTravels = filteredTravels.filter((travel) => travel.departure_date === formattedDate);
        }

        const selectedCcs = Object.keys(checkboxes2).filter(key => checkboxes2[key]);
        if (selectedCcs.length > 0) {
            filteredTravels = filteredTravels.filter((travel) => selectedCcs.includes(travel.cc_moto.toString()));
        }

        const selectedTypes = Object.keys(checkboxes).filter(key => checkboxes[key]);
        if (selectedTypes.length > 0) {
            filteredTravels = filteredTravels.filter((travel) => {
                const travelType = travel.type_moto.toLowerCase().replace(' ', '');
                return selectedTypes.includes(travelType);
            });
        }

        if (participants > 0) {
            filteredTravels = filteredTravels.filter((travel) => travel.users.length === participants || travel.users.length > 10);
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

    }, [city, startDate, participants, checkboxes, days, alltravel, setTravels, checkboxes2]);

    return (
        <div className="mt-2">
            <input
                type="text"
                required
                name="city"
                className="form-control rounded-pill"
                placeholder="Città di partenza"
                onChange={(e) => setCity(e.target.value.toUpperCase())}
            />
            <hr />
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control rounded-pill"
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText='Data di partenza'
            />
            <hr />
            <Form.Label className="fw-bold">
                Tipologia moto{' '}
                <OverlayTrigger
                    placement="right"
                    overlay={
                        <Tooltip id="tooltip-help">
                            Seleziona i tipi di moto che desideri includere nella ricerca.
                        </Tooltip>
                    }
                >
                    <span style={{ cursor: 'pointer' }}>?</span>
                </OverlayTrigger>
            </Form.Label>
            {Object.keys(checkboxes).map((key) => {
                const label =
                    key === 'racebikes' ? 'Race Bikes' : key === 'offroad' ? 'Off Road' : key.charAt(0).toUpperCase() + key.slice(1);
                return (
                    <div className="form-check ps-0" key={key}>

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
                        <label className="form-check-label ms-2" htmlFor={key}>
                            {label}
                        </label>
                    </div>
                );
            })}
            <hr />
            <Form.Label className="fw-bold">
                Cilindrata minima{' '}
                <OverlayTrigger
                    placement="right"
                    overlay={
                        <Tooltip id="tooltip-help">
                            Chiedi al creatore del viaggio se la cilindrata della tua moto è adatta per il tipo di percorso previsto.
                        </Tooltip>
                    }
                >
                    <span style={{ cursor: 'pointer' }}>?</span>
                </OverlayTrigger>
            </Form.Label>
            {Object.keys(checkboxes2).map((key) => {
                const label =
                    key === 'racebikes' ? 'Race Bikes' : key === 'offroad' ? 'Off Road' : key.charAt(0).toUpperCase() + key.slice(1);
                return (
                    <div className="form-check ps-0" key={key}>
                        <Switch
                            checked={checkboxes2[key]}
                            onChange={(checked) => handleCheckboxChange2(key, checked)}
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
                        <label className="form-check-label ms-2" htmlFor={key}>
                            {label}
                        </label>
                    </div>
                );
            })}
            <Form.Label className="mt-3 fw-bold">Numero partecipanti</Form.Label>
            <Slider
                min={0}
                max={10}
                step={1}
                value={participants}
                onChange={(value) => setParticipants(value)}
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
                onChange={(value) => setDays(value)}
                trackStyle={{ backgroundColor: '#86d3ff' }}
                handleStyle={{ borderColor: '#2693e6', backgroundColor: '#2693e6' }}
            />
            <p className='mb-0'>Giorni in viaggio:</p>
            <div className="fw-bold text-secondary">{days === 0 ? 'Nessun filtro' : days}</div>
        </div>
    );
}
