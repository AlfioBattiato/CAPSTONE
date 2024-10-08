import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTravel } from "../../redux/actions";
import { BsCalendar2DateFill } from "react-icons/bs";
import MyRadio from "../myradio";
import { Row } from "react-bootstrap";

export default function SetTravelSettings() {
    const dispatch = useDispatch();

    const travel = useSelector((state) => state.infotravels.setTravel);

    const [startDate, setStartDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCC, setSelectedCC] = useState("");

    useEffect(() => {
        if (travel.departure_date) {
            setStartDate(new Date(travel.departure_date));
        }else{
            setStartDate(null)
        }
        if (travel.type_moto) {
            setSelectedCategory(travel.type_moto);
        }else{
            setSelectedCategory("")
        }
        if (travel.cc_moto) {
            setSelectedCC(travel.cc_moto);
        }else{
            setSelectedCC("")
        }
    }, [travel]);

    const handleDateChange = (date) => {
        const adjustedDate = date ? new Date(date.setHours(12, 0, 0, 0)) : null;
        setStartDate(adjustedDate);
        const updatedTravel = {
            ...travel,
            departure_date: adjustedDate ? adjustedDate.toISOString() : null,
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
        
            <div className="d-flex gap-1 align-items-center">
                <BsCalendar2DateFill className=" " />
                <ReactDatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    className="form-control rounded-pill"
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    placeholderText="Data di partenza"
                />
            </div>
            <hr className="my-3" />
            <Row>
                <div className="col-12 col-xxl-6 border-end">
                    <p className="mb-1 ps-2 fw-bold">Categorie moto:</p>
                    <MyRadio
                        name="motoCategory"
                        options={[
                            { id: "scooter", label: "Scooter", value: "Scooter" },
                            { id: "racebikes", label: "Race bikes", value: "Race Bikes" },
                            { id: "motocross", label: "Motocross", value: "Motocross" },
                            { id: "offroad", label: "Off Road", value: "Off Road" },
                            { id: "harley", label: "Harley", value: "Harley" }
                        ]}
                        selectedValue={selectedCategory}
                        onChange={handleCategoryChange}
                    />
                </div>
                <div className="col-12 col-xxl-6">
                    <p className="mb-1 ps-2 fw-bold">Cilindrata:</p>
                    <MyRadio
                        name="motoCC"
                        options={[
                            { id: "150", label: "150cc", value: "150" },
                            { id: "300", label: "300cc", value: "300" },
                            { id: "600", label: "600cc", value: "600" },
                            { id: "1200", label: "1200cc", value: "1200" }
                        ]}
                        selectedValue={selectedCC}
                        onChange={handleCCChange}
                    />
                </div>
            </Row>
        </div>
    );
}
