import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

export default function FilterTravel() {
    const [startDate, setStartDate] = useState(new Date());
    const [cc, setCc] = useState(150);
    const [participants, setParticipants] = useState(1);
    const [days, setDays] = useState(1);

    const handleCcChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value < 150) setCc(150);
        else if (value >= 150 && value < 300) setCc(150);
        else if (value >= 300 && value < 600) setCc(300);
        else if (value >= 600 && value < 1200) setCc(600);
        else setCc(1200);
    };

    return (
        <>
            <div className="mt-2">
                <input
                    type="text"
                    required
                    name="city"
                    className="form-control"
                    placeholder="Città di partenza"
                />
                <hr />
                {/* Calendar */}
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="form-control"
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                />
                <hr />
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="scooter" />
                    <label className="form-check-label" htmlFor="scooter">scooter</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="race bikes" />
                    <label className="form-check-label" htmlFor="race bikes">race bikes</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="motocross" />
                    <label className="form-check-label" htmlFor="motocross">motocross</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="off-road" />
                    <label className="form-check-label" htmlFor="off-road">off-road</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="harley" />
                    <label className="form-check-label" htmlFor="harley">harley</label>
                </div>

                <Form.Label className="mt-3 fw-bold">Cilindrata minima</Form.Label>
                <Form.Range min={150} max={1200} step={150} value={cc} onChange={handleCcChange} />
                <p>Cilindrata: {cc} cc</p>
                <hr />
                <Form.Label className="mt-3 fw-bold">Numero partecipanti</Form.Label>
                <Form.Range min={1} max={10} value={participants} onChange={(e) => setParticipants(e.target.value)} />
                <p>Numero partecipanti: {participants}</p>
                <hr />
                <Form.Label className="mt-3 fw-bold">Giorni in viaggio</Form.Label>
                <Form.Range min={1} max={10} value={days} onChange={(e) => setDays(e.target.value)} />
                <p>Giorni in viaggio: {days}</p>
            </div>
        </>
    );
}
