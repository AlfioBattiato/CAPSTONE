import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
import { removeMeta, setAllreduxTravel, setMetas } from "../redux/actions";
import "../components/css/btntravel.css";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Sponsor from "../components/Sponsor";

function Homepage() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const travel = useSelector((state) => state.infotravels.setTravel);
  const metas = useSelector((state) => state.infotravels.metas);
  const infotravels = useSelector((state) => state.infotravels);
  const query = useSelector((state) => state.infotravels.formData.query);
  const navigate = useNavigate();

  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    dispatch(setAllreduxTravel())
  }, [dispatch]);

  //per settare i campi quando non ce una meta di partenza
  useEffect(() => {
    if (query === '') {
      dispatch(setAllreduxTravel())
      setWeatherData([])
    }
  }, [query]);

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
            // console.log(data.list)
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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedMetas = Array.from(metas);
    const [removed] = reorderedMetas.splice(result.source.index, 1);
    reorderedMetas.splice(result.destination.index, 0, removed);

    dispatch(setMetas(reorderedMetas));
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
      humidity={data.main.humidity}
    />
  );
  const getImageSource = (vehicleType) => {
    switch (vehicleType) {
      case "Race Bikes":
        return "/assets/moto/moto3.png";
      case "racebikes":
        return "/assets/moto/moto3.png";
      case "Motocross":
        return "/assets/moto/motocross3.png";
      case "Scooter":
        return "/assets/moto/vespa3.png";
      case "scooter":
        return "/assets/moto/vespa3.png";
      case "Off Road":
        return "/assets/moto/offroad3.png";
      case "Harley":
        return "/assets/moto/harley3.png";
      case "harley":
        return "/assets/moto/harley3.png";
      default:
        return "/assets/moto/moto.png";
    }
  };
  const submit = async (ev) => {
    ev.preventDefault();


    try {
      const body = {
        start_location: infotravels.setTravel.start_location.city,
        type_moto: infotravels.setTravel.type_moto,
        cc_moto: infotravels.setTravel.cc_moto,
        lat: infotravels.setTravel.start_location.lat,
        lon: infotravels.setTravel.start_location.lon,
        departure_date: infotravels.setTravel.departure_date,
        expiration_date: infotravels.details.expiration_date,
        days: infotravels.details.days,
      };

      const travelResponse = await axios.post("/api/travel", body);
      for (const meta of infotravels.metas) {
        const metaBody = {
          travel_id: travelResponse.data.id,
          name_location: meta.city,
          lat: meta.lat,
          lon: meta.lon,
        };
        await axios.post("/api/meta", metaBody);
      }

      navigate("/AllTravels/");
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="container-fluid">
      <h5 className="mt-2 text-center">Organizza il percorso per il tuo viaggio</h5>
      <Row className="mt-3 gy-3">
        <Col md={4} className="border-end">
          <SetTravel />
          <SetTravelSettings />
          <div className="mt-3">
            <RouteInstructions />
          </div>
          {/* <div className="mt-3">
            <Sponsor />
          </div> */}
        </Col>
        <Col md={8} >
          <Maps />
          <All_interest_places />
          {weatherData.length > 0 ? (
            <div className="p-2 rounded mt-2">
              <p className="fw-bold text-center mt-5">Ecco le informazioni meteo previste tra oggi e i prossimi 5 giorni</p>
              <Row className="row row-cols-auto justify-content-center gx-2 gy-2">
                {weatherData
                  .slice(0, 33)
                  .filter((_, index) => index % 8 === 0)
                  .map(renderMeteo)}
              </Row>
            </div>
          ) : (
            <div className="p-2 rounded bg-white mt-2">
              <p className="fw-bold">Informazioni meteo previste tra oggi e i prossimi 5 giorni</p>
              <p className="">Imposta prima la città di partenza</p>
            </div>
          )}

          <div className="newinterestplace mt-3 p-2">
            <h1 className="display-5 text-center">Hai un luogo che vorresti condividere?</h1>
            <p className="text-center">Aiuta la community a visitare luoghi inesplorati</p>
            <Link to="/createInterestPlace" className="me-2">
              <Button variant="outline-light" className="my-3">
                Crea nuovo punto di interesse
              </Button>
            </Link>
          </div>
          <div className="d-flex pe-3">
            <button className="ms-auto my-5 btnT" onClick={handleShow}>
              Crea Viaggio
            </button>
          </div>

          <div className="travelmodal">
            <Modal  show={show} onHide={handleClose} centered size="lg" className="createTravelmodal">
           
                  <Modal.Header closeButton>
                    <Modal.Title>Riepilogo</Modal.Title>
                  </Modal.Header>
                  <div className="resumeTravel" style={{ backgroundImage: `url(${getImageSource(travel.type_moto)})` }}>
                  <Modal.Body  className=' resumeTravel_body' >
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
                      {travel.departure_date ? (
                        <span className="fw-bold">{travel.departure_date.split("T")[0].split(":")}</span>
                      ) : (
                        <span className="text-danger">Inserisci una data</span>
                      )}
                    </p>
                    <p>Mete:{metas.length > 0 ? (
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="metas">
                          {(provided) => (
                            <ul className="list-group mt-1" {...provided.droppableProps} ref={provided.innerRef}>
                              {metas.map((meta, index) => (
                                <Draggable key={index} draggableId={`${index}`} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="d-flex mt-1 align-items-center ps-0 gap-2"
                                    >
                                      <FaMapMarkerAlt className="text-danger" />
                                      <li className="list-group-item bg-dark p-2 text-white rounded w-100 overflow-hidden d-flex justify-content-between align-items-center">
                                        {meta.city}
                                        <button className="btn btn-dark text-danger btn-sm" onClick={() => handleRemoveMeta(index)}>
                                          <FaTrash />
                                        </button>
                                      </li>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </DragDropContext>
                    ) : (
                      <span className="text-danger"> Inserisci almeno una meta</span>
                    )}</p>

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
                        <span className="text-danger">Cilindrata non impostata</span>
                      )}
                    </p>
                  </Modal.Body>

                  </div>
                  <hr />
                  <div className="d-flex py-3">

                    <button className="btnT  ms-auto me-2" onClick={submit}>
                      Completa creazione
                    </button>
                  </div>
            </Modal>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Homepage;
