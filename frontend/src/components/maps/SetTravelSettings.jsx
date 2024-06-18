import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTravel } from "../../redux/actions";
import { BsCalendar2DateFill } from "react-icons/bs";

export default function SetTravelSettings() {
    const [startDate, setStartDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCC, setSelectedCC] = useState("");

    const travel = useSelector((state) => state.infotravels.setTravel);
    const dispatch = useDispatch();

    const handleDateChange = (date) => {
        setStartDate(date);
        const updatedTravel = {
            ...travel,
            startDate: date ? date.toISOString() : null,
        };
        dispatch(setCurrentTravel(updatedTravel));
    };

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        const updatedTravel = {
            ...travel,
            type_moto: category,
        };
        dispatch(setCurrentTravel(updatedTravel));
    };

    const handleCCChange = (event) => {
        const cc = event.target.value;
        setSelectedCC(cc);
        const updatedTravel = {
            ...travel,
            cc_moto: cc,
        };
        dispatch(setCurrentTravel(updatedTravel));
    };

    return (
        <div className="bg-white p-3 rounded mt-3">
            <p className="mb-1 ps-2 fw-bold">Data partenza:</p>
            <BsCalendar2DateFill className="me-2 mb-1" />
            <ReactDatePicker
                selected={startDate}
                onChange={handleDateChange}
                className="form-control rounded-pill"
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Data di partenza"
            />
            <hr className="my-3" />
            <p className="mb-1 ps-2 fw-bold">Categorie moto:</p>
            <div className="d-flex flex-wrap flex-column">
                <RadioInput
                    label="Scooter"
                    value="scooter"
                    checked={selectedCategory === "scooter"}
                    onChange={handleCategoryChange}
                />
                <RadioInput
                    label="Racebikes"
                    value="racebikes"
                    checked={selectedCategory === "racebikes"}
                    onChange={handleCategoryChange}
                />
                <RadioInput
                    label="Motocross"
                    value="motocross"
                    checked={selectedCategory === "motocross"}
                    onChange={handleCategoryChange}
                />
                <RadioInput
                    label="Offroad"
                    value="offroad"
                    checked={selectedCategory === "offroad"}
                    onChange={handleCategoryChange}
                />
                <RadioInput
                    label="Harley"
                    value="harley"
                    checked={selectedCategory === "harley"}
                    onChange={handleCategoryChange}
                />
            </div>
            <hr className="my-3" />
            <p className="mb-1 ps-2 fw-bold">Cilindrata:</p>
            <div className="d-flex  flex-column ">
                <RadioInput
                    label="150cc"
                    value="150"
                    checked={selectedCC === "150"}
                    onChange={handleCCChange}
                />
                <RadioInput
                    label="300cc"
                    value="300"
                    checked={selectedCC === "300"}
                    onChange={handleCCChange}
                />
                <RadioInput
                    label="600cc"
                    value="600"
                    checked={selectedCC === "600"}
                    onChange={handleCCChange}
                />
                <RadioInput
                    label="1200cc"
                    value="1200"
                    checked={selectedCC === "1200"}
                    onChange={handleCCChange}
                />
            </div>
        </div>
    );
}

// Componente per l'input di tipo radio
const RadioInput = ({ label, value, checked, onChange }) => (
    <div className="form-check mx-2 my-1">
        <input
            type="radio"
            id={value}
            name={label}
            value={value}
            checked={checked}
            onChange={onChange}
            className="form-check-input"
        />
        <label htmlFor={value} className="form-check-label">
            {label}
        </label>
    </div>
);
