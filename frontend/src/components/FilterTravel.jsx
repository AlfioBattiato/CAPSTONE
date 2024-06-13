import React from "react";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../redux/actions";

export default function FilterTravel() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.infotravels.filters);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    };
    dispatch(setFilters(newFilters));
  };

  const handleTypeChange = (e) => {
    const { name, checked } = e.target;
    const newTypes = {
      ...filters.types,
      [name]: checked,
    };
    dispatch(setFilters({ ...filters, types: newTypes }));
  };

  const handleCcChange = (e) => {
    const value = parseInt(e.target.value, 10);
    dispatch(setFilters({ ...filters, cc: value }));
  };

  const handleDateChange = (date) => {
    dispatch(setFilters({ ...filters, startDate: date ? date.toISOString() : null }));
  };

  return (
    <div className="mt-2">
      <input
        type="text"
        name="city"
        className="form-control"
        placeholder="Città di partenza"
        value={filters.city}
        onChange={handleInputChange}
      />
      <hr />
      <DatePicker
        selected={filters.startDate ? new Date(filters.startDate) : null}
        onChange={handleDateChange}
        className="form-control"
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        isClearable
        placeholderText="Seleziona una data"
      />
      <hr />
      {["scooter", "raceBikes", "motocross", "offRoad", "harley"].map((type) => (
        <div className="form-check" key={type}>
          <input
            className="form-check-input"
            type="checkbox"
            name={type}
            checked={filters.types[type]}
            onChange={handleTypeChange}
          />
          <label className="form-check-label" htmlFor={type}>
            {type}
          </label>
        </div>
      ))}
      <Form.Label className="mt-3 fw-bold">Cilindrata minima</Form.Label>
      <Form.Range min={150} max={1200} step={150} value={filters.cc || 150} onChange={handleCcChange} />
      <p>Cilindrata: {filters.cc} cc</p>
      <hr />
      <Form.Label className="mt-3 fw-bold">Numero partecipanti</Form.Label>
      <Form.Range min={1} max={10} name="participants" value={filters.participants || 1} onChange={handleInputChange} />
      <p>Numero partecipanti: {filters.participants}</p>
      <hr />
      <Form.Label className="mt-3 fw-bold">Giorni in viaggio</Form.Label>
      <Form.Range min={1} max={10} name="days" value={filters.days || 1} onChange={handleInputChange} />
      <p>Giorni in viaggio: {filters.days}</p>
    </div>
  );
}
