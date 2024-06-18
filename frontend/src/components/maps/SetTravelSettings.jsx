import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTravel } from "../../redux/actions";


export default function SetTravelSettings() {
    const [startDate, setStartDate] = useState(null);
    const travel = useSelector(state => state.infotravels.setTravel);
    const dispatch = useDispatch();
    
    const handleDateChange = (date) => {
        setStartDate(date);
        const updatedTravel = {
            ...travel,
            startDate: date ? date.toISOString() : null
        };
        dispatch(setCurrentTravel(updatedTravel));
    };

    return (
        <div className="bg-white p-3 rounded mt-3">
            <p className="mb-1 ps-2 fw-bold">Data partenza:</p>
            <ReactDatePicker
                selected={startDate}
                onChange={handleDateChange}
                className="form-control rounded-pill"
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText='Data di partenza'
            />
        </div>
    )
}
