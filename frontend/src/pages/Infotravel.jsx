import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import RoutingMachine from "../components/maps/RoutingMachine";
import { useDispatch, useSelector } from "react-redux";
import { SiGooglemaps } from "react-icons/si";
import { FaTrash, FaMotorcycle, FaSuperpowers } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { BsCalendarFill, BsFillCalendar2CheckFill } from "react-icons/bs";
import { LiaCalendarSolid } from "react-icons/lia";
import { FaPeopleRobbery } from "react-icons/fa6";
import L from "leaflet";
import { CgDanger } from "react-icons/cg";
import { BsFillPeopleFill } from "react-icons/bs";
import { setSelectedChat, setChats } from "../redux/actions";
import startIconUrl from "/assets/maps/ico1.gif";
import arriveIconUrl from "/assets/maps/blue.png";
import singolarmetaIconUrl from "/assets/maps/ico20.png";

function Infotravel() {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [authUserRole, setAuthUserRole] = useState(null);
  const [position, setPosition] = useState([0, 0]);
  const dispatch = useDispatch();
  const [key, setKey] = useState(0);
  const [disable, setDisable] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const utenteLoggato = useSelector((state) => state.auth.user.email);
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [participantsPending, setParticipantsPending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/travel/${id}`)
      .then((response) => {
        console.log(response.data);
        setTravel(response.data);
        setPosition([response.data.lat, response.data.lon]);
        setAuthUserRole(response.data.auth_user_role);
        setKey((oldKey) => oldKey + 1);
        setActiveParticipants(response.data.users.filter((user) => user.pivot.active === 1));
        setParticipantsPending(response.data.users.filter((user) => user.pivot.active === 0));

        response.data.users.forEach((e) => {
          if (e.email === utenteLoggato) {
            setDisable(true);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching travel:", error);
      });
  }, [id, utenteLoggato]);

  const addGuest = () => {
    const userExists = travel.users.some((user) => user.email === utenteLoggato && user.pivot.active === 0);
    if (!userExists) {
      axios
        .get("/sanctum/csrf-cookie")
        .then(() => {
          return axios.post(`/api/travels/${travel.id}/add-guest`);
        })
        .then((response) => {
          setDisable(true);
          console.log("Request sent:", response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("User is already a guest or request already sent.");
    }
  };

  const destroy = () => {
    axios
      .get("/sanctum/csrf-cookie")
      .then(() => {
        return axios.delete(`/api/travel/${travel.id}`);
      })
      .then((response) => {
        console.log("Travel deleted:", response.data);
        alert("Viaggio eliminato con successo");
        navigate("/AllTravels/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const approveGuest = (user_id) => {
    axios
      .get("/sanctum/csrf-cookie")
      .then(() => {
        return axios.post(`/api/travels/${travel.id}/approve-guest/${user_id}`);
      })
      .then((response) => {
        console.log("Approved:", response.data);
        setParticipantsPending((prev) => prev.filter((user) => user.id !== user_id));
        setActiveParticipants((prev) => [...prev, response.data.user]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const rejectGuest = (user_id) => {
    axios
      .get("/sanctum/csrf-cookie")
      .then(() => {
        return axios.post(`/api/travels/${travel.id}/reject-guest/${user_id}`);
      })
      .then((response) => {
        console.log("Rejected:", response.data);
        setParticipantsPending((prev) => prev.filter((user) => user.id !== user_id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Crea l'icona personalizzata per la start location
  const startIcon = new L.Icon({
    iconUrl: startIconUrl,
    iconSize: [40, 40], // Dimensione dell'icona
    iconAnchor: [18, 30], // Punto dell'icona che corrisponderà alla posizione
    popupAnchor: [0, -40], // Punto del popup che corrisponderà alla posizione
    className: "custom-start-icon", // Aggiungi una classe personalizzata se necessario
  });

  // Crea l'icona personalizzata per l'ultima meta (arrivo)
  const arriveIcon = new L.Icon({
    iconUrl: arriveIconUrl,
    iconSize: [40, 40], // Dimensione dell'icona
    iconAnchor: [15, 30], // Punto dell'icona che corrisponderà alla posizione
    popupAnchor: [0, -30], // Punto del popup che corrisponderà alla posizione
    className: "custom-arrive-icon", // Aggiungi una classe personalizzata se necessario
  });

  // Crea l'icona personalizzata per le singole mete
  const metaIcon = new L.Icon({
    iconUrl: singolarmetaIconUrl,
    iconSize: [40, 40], // Dimensione dell'icona
    iconAnchor: [15, 30], // Punto dell'icona che corrisponderà alla posizione
    popupAnchor: [0, -30], // Punto del popup che corrisponderà alla posizione
    className: "custom-meta-icon", // Aggiungi una classe personalizzata se necessario
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const goToChat = async () => {
    setLoadingChat(true);
    try {
      const response = await axios.get("/api/chats");
      const chat = response.data.find((chat) => chat.type === "travel" && chat.travel_id === travel.id);
      if (chat) {
        dispatch(setSelectedChat(chat));
        navigate("/lobbies");
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="container">
      {travel ? (
        <>
          <Row className="mt-5">
            <Col md={6}>
              {authUserRole !== "creator_travel" ? (
              
                  <div className="mb-2 ">
                    <Button variant="dark" className="me-2 d-flex align-items-center" onClick={goToChat} disabled={loadingChat}>
                      {loadingChat ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <BsFillPeopleFill /> Chat viaggio
                        </>
                      )}
                    </Button>
                    <Button variant="outline-success" disabled={disable} onClick={addGuest}>
                      Chiedi di partecipare
                    </Button>
                
                    {disable && (
                      <p className="text-success">
                        Richiesta inviata! Attendi di essere accettato dall&apos;amministratore del viaggio
                      </p>
                    )}
                  </div>
                  
                  
                 
              ) : (
                <>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex">
                    <Button variant="dark" className="me-2 d-flex align-items-center" onClick={goToChat} disabled={loadingChat}>
                      {loadingChat ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <>
                          <BsFillPeopleFill /> Chat viaggio
                        </>
                      )}
                    </Button>
                      <Button
                        variant="outline-dark"
                        className="me-2 d-flex align-items-center"
                        onClick={() => navigate(`/updateTravel/${travel.id}`)}
                      >
                        Modifica <MdEdit />
                      </Button>
                      <Button variant="outline-danger" className="me-2 d-flex align-items-center" onClick={handleShow}>
                        Elimina viaggio <FaTrash />
                      </Button>
                      
                    </div>
                   
                  </div>
                  <hr />
                </>
              )}
              <h4>{travel.start_location}</h4>
              <p>
                <BsCalendarFill /> Data di partenza:{" "}
                <span className="fw-bold">{formatDate(travel.departure_date)}</span>
              </p>
              <p>
                <BsFillCalendar2CheckFill /> Data di arrivo:{" "}
                <span className="fw-bold">{formatDate(travel.expiration_date)}</span>
              </p>
              <p>
                <LiaCalendarSolid /> Giorni in viaggio: <span className="fw-bold">{travel.days}</span>
              </p>
              <p>
                <FaMotorcycle /> Tipologia di Moto: <span className="fw-bold">{travel.type_moto}</span>
              </p>
              <p>
                <FaSuperpowers /> Cavalli minimi per partecipare: <span className="fw-bold">{travel.cc_moto}</span>
              </p>
              <p>
                <FaPeopleRobbery /> Partecipanti attuali: <span className="fw-bold">{activeParticipants.length}</span>
              </p>

              {activeParticipants && activeParticipants.length > 0 && (
                <div className="my-2 gap-2 border rounded p-1 bg-white">
                  {activeParticipants.map((user, index) => (
                    <Link className="nav-link" to={`/profile/${user.id}`} key={index}>
                      <div>
                        <li className="list-group-item py-2 w-100 gap-2 overflow-hidden ps-2 d-flex align-items-center bg-secondary bg-opacity-10">
                          <img src={user.profile_img} alt="Profile" className="img_profile" />
                          <span>{user.username}</span>
                          <span>{user.pivot.role === "creator_travel" ? "(Amministratore)" : "(Partecipante)"}</span>
                        </li>
                        <hr className="m-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {authUserRole === "creator_travel" && participantsPending.length > 0 && (
                <>
                  <p className="fw-bold mb-0 mt-3">Richieste di partecipazione:</p>
                  {participantsPending.map((user, index) => (
                    <div key={index} className="d-flex mt-1 align-items-center my-2 gap-2 border rounded p-1">
                      <Link className="nav-link" to={`/profile/${user.id}`}>
                        <li className="list-group-item rounded w-100 gap-2 overflow-hidden d-flex align-items-center">
                          <img src={user.profile_img} alt="Profile" className="img_profile" />
                          <span>{user.email}</span>
                          <span>{user.pivot.role === "creator_travel" ? "(Amministratore)" : "(Partecipante)"}</span>
                          <span className="text-success cursor" onClick={() => approveGuest(user.id)}>
                            Accetta
                          </span>
                          <span className="text-danger cursor" onClick={() => rejectGuest(user.id)}>
                            Rifiuta
                          </span>
                        </li>
                      </Link>
                    </div>
                  ))}
                </>
              )}
            </Col>
            <Col md={6}>
              {travel.metas && travel.metas.length > 0 && (
                <div className="my-2 gap-2 border rounded p-3 bg-white">
                  <p className="fw-bold">Tappe:</p>
                  <li className="list-group-item bg-dark p-2 text-white rounded w-100 overflow-hidden mb-2 d-flex gap-2 align-items-center">
                    1 - <SiGooglemaps className="text-danger" /> {travel.start_location}
                  </li>
                  {travel.metas.map((meta, index) => (
                    <div key={index}>
                      <li className="mb-2 list-group-item bg-dark p-2 text-white rounded w-100 overflow-hidden d-flex gap-2 align-items-center">
                        {index + 2} : <SiGooglemaps className="text-danger" /> {meta.name_location}
                      </li>
                    </div>
                  ))}
                </div>
              )}
            </Col>
            <Col md={12}>
              <MapContainer
                center={position}
                zoom={5}
                style={{ height: "40rem", width: "100%", borderRadius: "25px", marginBlock: "1rem" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {travel.start_location && travel.lat && travel.lon && (
                  <Marker position={[travel.lat, travel.lon]} icon={startIcon}>
                    <Popup>Start Location: {travel.start_location.city}</Popup>
                  </Marker>
                )}
                {travel.metas.map((meta, index) => {
                  const isLastMeta = index === travel.metas.length - 1;
                  return (
                    <Marker key={index} position={[meta.lat, meta.lon]} icon={isLastMeta ? arriveIcon : metaIcon}>
                      <Popup>Meta: {meta.city}</Popup>
                    </Marker>
                  );
                })}
                {travel.lon && (
                  <RoutingMachine
                    lat={travel.lat}
                    lon={travel.lon}
                    metas={travel.metas}
                    key={key}
                    dispatch={dispatch}
                  />
                )}
              </MapContainer>
            </Col>
          </Row>
        </>
      ) : (
        <p>Loading travel details...</p>
      )}

      {/* modale elimina viaggio */}
      <Modal show={show} onHide={handleClose} centered size="lg" className="delModal">
        <div className="deletemodal rounded">
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <p className="text-center mb-0">
              <CgDanger /> Sei sicuro di voler eliminare il viaggio in modo definitivo?
            </p>
            <p className="fs-6 text-center text-secondary">
              questa azione eliminerà il viaggio anche per gli altri partecipanti
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline-danger" onClick={destroy}>
              Elimina
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}

export default Infotravel;
