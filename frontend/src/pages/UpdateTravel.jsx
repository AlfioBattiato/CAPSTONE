import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import { removeMeta, setCurrentTravel, setFormData, setMetas } from "../redux/actions";
import { LOGIN } from "../redux/actions";

function UpdateTravel() {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const travel = useSelector((state) => state.infotravels.setTravel);
  const metas = useSelector((state) => state.infotravels.metas);
  const navigate = useNavigate();
  const [authUserRole, setAuthUserRole] = useState(null);

  useEffect(() => {
  
    const formDataUpdate = {
      query: 'Punto interattivo',
      metaQuery: ''
    };
  
    axios
      .get(`/api/travel/${id}`)
      .then((response) => {
        console.log(response.data);

        const updatedTravel = {
          ...travel,
          start_location: {
            city: response.data.start_location,
            lat: response.data.lat,
            lon: response.data.lon,
          },
          startDate: response.data.departure_date,
          cc_moto: response.data.cc_moto,
          type_moto: response.data.type_moto,
        
        };
        const updatedMetas = response.data.metas


        dispatch(setCurrentTravel(updatedTravel));
        dispatch(setMetas(updatedMetas));
        dispatch(setFormData(formDataUpdate));
        setAuthUserRole(response.data.auth_user_role);

      })
      .catch((error) => {
        console.error("Error fetching travel:", error);
      });
  }, [id]);


  const handleRemoveMeta = (index) => {
    dispatch(removeMeta(index));
  };



  // const submit = async (ev) => {
  //   ev.preventDefault();
  //   if (!isAuthenticated) {
  //     console.error("User is not authenticated");
  //     return;
  //   }
  //   console.log("Submit called with travel data:", infotravels);
  //   const formatDate = (isoDateString) => {
  //     const date = new Date(isoDateString);
  //     const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  //     return date.toLocaleDateString('it-IT', options);
  //   };

  //   try {
  //     const body = {
  //       start_location: infotravels.setTravel.start_location.city,
  //       type_moto: infotravels.setTravel.type_moto,
  //       cc_moto: infotravels.setTravel.cc_moto,
  //       lat: infotravels.setTravel.start_location.lat,
  //       lon: infotravels.setTravel.start_location.lon,
  //       departure_date: formatDate(infotravels.setTravel.startDate),
  //       expiration_date: formatDate(infotravels.details.expiration_date),
  //       days: infotravels.details.days,
  //     };

  //     console.log("Sending travel data to backend:", body);
  //     const travelResponse = await axios.post("/api/travel", body);
  //     console.log("Travel created successfully:", travelResponse.data);

  //     for (const meta of infotravels.metas) {
  //       const metaBody = {
  //         travel_id: travelResponse.data.id,
  //         name_location: meta.city,
  //         lat: meta.lat,
  //         lon: meta.lon,
  //       };
  //       console.log("Sending meta data to backend:", metaBody);
  //       await axios.post("/api/meta", metaBody);
  //     }

  //     navigate("/AllTravels/");
  //   } catch (error) {
  //     console.error("There was an error!", error);
  //     if (error.response) {
  //       console.error("Error response data:", error.response.data);
  //       console.error("Error response status:", error.response.status);
  //       console.error("Error response headers:", error.response.headers);
  //     }
  //   }
  // };

  return (
    <div className="container-fluid">
      <h1>Modifica viaggio</h1>
      <Row className="mt-3 pb-5">
        <Col md={3} className="border-end">

          <SetTravel />
          <SetTravelSettings />
        </Col>
        <Col md={7}>

          <Maps />
          {/* <All_interest_places /> */}
          <hr />
          <div className="mt-5 d-flex justify-content-end">
            <Button variant="success" onClick={handleShow}>
              Crea Viaggio
            </Button>
            {/* <Modal show={show} onHide={handleClose}>
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

                {travel.metas.length > 0 ? (
                  <ul className="list-group mt-1">
                    {travel.metas.map((meta, index) => (
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
                <Button variant="primary" onClick={()=>console.log('o')}>
                  Completa creazione
                </Button>
              </Modal.Footer>
            </Modal> */}
          </div>
        </Col>
        <Col md={2} className="border-start">
          <RouteInstructions />
        </Col>
      </Row>
    </div>
  );
}

export default UpdateTravel;
