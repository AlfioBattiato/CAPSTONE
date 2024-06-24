import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import SetTravel from "../components/maps/SetCityTravel";
import Maps from "../components/maps/Maps";
import SetTravelSettings from "../components/maps/SetTravelSettings";
import RouteInstructions from "../components/maps/RouteInstructions";
import All_interest_places from "../components/interest_places/All_interest_places";
import Meteo from "../components/meteo";
import Modal from "react-bootstrap/Modal";
import { FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { removeMeta } from "../redux/actions";
import { LOGIN } from "../redux/actions";

function Homepage() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const travel = useSelector((state) => state.infotravels.setTravel);
  const metas = useSelector((state) => state.infotravels.metas);
  const infotravels = useSelector((state) => state.infotravels);
  const navigate = useNavigate();

  const [weatherData, setWeatherData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("/sanctum/csrf-cookie").then(() => {
      axios
        .get("/api/user")
        .then((res) => {
          console.log("User authenticated:", res.data);
          dispatch({
            type: LOGIN,
            payload: res.data,
          });
          setIsAuthenticated(true);
        })
        .catch((err) => {
          console.error("Authentication error:", err);
        });
    });
  }, [dispatch]);

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

  const handleRemoveMeta = (index) => {
    dispatch(removeMeta(index));
  };

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

  const submit = async (ev) => {
    ev.preventDefault();
    if (!isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }
    console.log("Submit called with travel data:", infotravels);

    try {
      const body = {
        start_location: infotravels.setTravel.start_location.city,
        type_moto: infotravels.setTravel.type_moto,
        cc_moto: infotravels.setTravel.cc_moto,
        lat: infotravels.setTravel.start_location.lat,
        lon: infotravels.setTravel.start_location.lon,
        departure_date: infotravels.setTravel.startDate,
        expiration_date: infotravels.details.expiration_date,
        days: infotravels.details.days,
      };

      console.log("Sending travel data to backend:", body);
      const travelResponse = await axios.post("/api/travel", body);
      console.log("Travel created successfully:", travelResponse.data);

      for (const meta of infotravels.metas) {
        const metaBody = {
          travel_id: travelResponse.data.id,
          name_location: meta.city,
          lat: meta.lat,
          lon: meta.lon,
        };
        console.log("Sending meta data to backend:", metaBody);
        await axios.post("/api/meta", metaBody);
      }

      navigate("/AllTravels/");
    } catch (error) {
      console.error("There was an error!", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
    }
  };

  return (
    <div className="container-fluid">
      <Row className="mt-3 pb-5">
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
          <p className="fw-bold text-center">Ecco le informazioni meteo previste tra oggi e i prossimi 5 giorni</p>
          {weatherData.length > 0 ? (
            <Row className="row-cols-2 row-cols-md-3 row-cols-xxl-5 gy-4">
              {weatherData
                .slice(0, 33)
                .filter((_, index) => index % 8 === 0)
                .map(renderMeteo)}
            </Row>
          ) : (
            <p className="text-center"> Imposta prima la città di partenza</p>
          )}
          <hr />
          <div className="mt-5 d-flex justify-content-end">
            <Button variant="success" onClick={handleShow}>
              Crea Viaggio
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Riepilogo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Citta partenza:{" "}
                  {travel.start_location.city ? (
                    <span className="fw-bold">{travel.start_location.city}</span>
                  ) : (
                    <span className="text-danger">Non impostata</span>
                  )}
                </p>
                <p>
                  Data partenza:{" "}
                  {travel.startDate ? (
                    <span className="fw-bold">{travel.startDate.split("T")[0].split(":")}</span>
                  ) : (
                    <span className="text-danger">Inserisci una data</span>
                  )}
                </p>
                <span>Mete:</span>

                {metas.length > 0 ? (
                  <ul className="list-group mt-1">
                    {metas.map((meta, index) => (
                      <div key={index} className="d-flex mt-1 align-items-center ps-0 gap-2">
                        <FaMapMarkerAlt className="text-danger" />
                        <li className="list-group-item bg-dark p-2 text-white rounded w-100 overflow-hidden d-flex justify-content-between align-items-center">
                          {meta.city}
                          <button className="btn btn-dark text-danger btn-sm" onClick={() => handleRemoveMeta(index)}>
                            <FaTrash />
                          </button>
                        </li>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <span className="text-danger ms-1">Inserisci almeno una meta</span>
                )}
                <p className="mt-2">
                  Tipo moto:{" "}
                  {travel.type_moto ? (
                    <span className="fw-bold">{travel.type_moto}</span>
                  ) : (
                    <span className="text-danger">Moto non impostata</span>
                  )}
                </p>
                <p>
                  Cilindrata:{" "}
                  {travel.cc_moto ? (
                    <span className="fw-bold">{travel.cc_moto}</span>
                  ) : (
                    <span className="text-danger">Moto non impostata</span>
                  )}
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={submit}>
                  Completa creazione
                </Button>
              </Modal.Footer>
            </Modal>
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
