import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import SetTravel from "../components/maps/SetCityTravel";
import Maps from "../components/maps/Maps";
import SetTravelSettings from "../components/maps/SetTravelSettings";
import RouteInstructions from "../components/maps/RouteInstructions";
import All_interest_places from "../components/interest_places/All_interest_places";
import Modal from "react-bootstrap/Modal";
import { FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import { removeMeta, setCurrentTravel, setFormData, setMetas } from "../redux/actions";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function UpdateTravel() {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const travel = useSelector((state) => state.infotravels.setTravel);
  const infotravels = useSelector((state) => state.infotravels);
  const metas = useSelector((state) => state.infotravels.metas);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);  // New loading state for submit

  const navigate = useNavigate();
  const [authUserRole, setAuthUserRole] = useState(null);

  useEffect(() => {
    setLoadingChat(true);

    axios
      .get(`/api/travel/${id}`)
      .then((response) => {
        const formDataUpdate = {
          query: response.data.start_location,
          metaQuery: ''
        };

        const updatedTravel = {
          ...travel,
          start_location: {
            city: response.data.start_location,
            lat: response.data.lat,
            lon: response.data.lon,
          },
          departure_date: response.data.departure_date,
          cc_moto: response.data.cc_moto,
          type_moto: response.data.type_moto,
        };
        const updatedMetas = response.data.metas;

        dispatch(setCurrentTravel(updatedTravel));
        dispatch(setMetas(updatedMetas));
        dispatch(setFormData(formDataUpdate));
        setAuthUserRole(response.data.auth_user_role);
      })
      .catch((error) => {
        console.error("Error fetching travel:", error);
      })
      .finally(() => {
        setLoadingChat(false);
      });
  }, [id]);

  const handleRemoveMeta = (index) => {
    dispatch(removeMeta(index));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedMetas = Array.from(infotravels.metas);
    const [removed] = reorderedMetas.splice(result.source.index, 1);
    reorderedMetas.splice(result.destination.index, 0, removed);

    dispatch(setMetas(reorderedMetas));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setLoadingSubmit(true);  // Set loading to true
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

      const travelResponse = await axios.put(`/api/travel/${id}`, body); // Update travel
      console.log("Travel update successfully:", travelResponse);
      await axios.delete(`/api/travel/${id}/metas/`); // Delete all previous metas

      for (const meta of infotravels.metas) {
        const metaBody = {
          travel_id: id,
          name_location: meta.city ? meta.city : meta.name_location,
          lat: meta.lat,
          lon: meta.lon,
        };
        await axios.post("/api/meta", metaBody); // Create new metas
      }

      navigate(`/infoTravel/${travelResponse.data.id}`);
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setLoadingSubmit(false);  // Set loading to false
    }
  };

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

  return (
    <div className="container-fluid">
      <p className="my-4 fw-bold">Modifica viaggio</p>
      <Row className="mt-3 pb-5">
        <Col lg={2} className="border-start">
          <RouteInstructions />
        </Col>
        <Col lg={5}>
          <Maps />
          <div className="mt-5 d-flex justify-content-end">
            <Modal show={show} onHide={handleClose} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Riepilogo</Modal.Title>
              </Modal.Header>
              <div className="resumeTravel" style={{ backgroundImage: `url(${getImageSource(travel.type_moto)})` }}>
                <Modal.Body className=' resumeTravel_body'>
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
                      <span className="fw-bold">{travel.departure_date}</span>
                    ) : (
                      <span className="text-danger">Inserisci una data</span>
                    )}
                  </p>
                  <span>Mete:</span>
                  {metas.length > 0 ? (
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
                                      {meta.city ? meta.city : meta.name_location}
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
              </div>
              <Modal.Footer>
                <button className="btnT" onClick={submit} disabled={loadingSubmit}>
                  {loadingSubmit ? <Spinner animation="border" size="sm" /> : 'Conferma Modifica'}
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </Col>
        <Col lg={5} className="border-end" style={{ height: '39rem' }}>
          <SetTravel />
          <SetTravelSettings />
          <All_interest_places />
          <div className="my-5 d-flex justify-content-start ">
            <button className="mb-2 btnT" onClick={handleShow}>
              Modifica viaggio
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default UpdateTravel;
