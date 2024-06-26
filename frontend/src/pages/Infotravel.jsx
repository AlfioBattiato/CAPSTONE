import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from '../components/maps/RoutingMachine';
import { useDispatch, useSelector } from "react-redux";

function Infotravel() {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [authUserRole, setAuthUserRole] = useState(null);
  const [position, setPosition] = useState([0, 0]);
  const dispatch = useDispatch();
  const [key, setKey] = useState(0);
  const [disable, setDisable] = useState(false);
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
        setActiveParticipants(response.data.users.filter(user => user.pivot.active === 1));
        setParticipantsPending(response.data.users.filter(user => user.pivot.active === 0));

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
        navigate('/AllTravels/');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const approveGuest = (user_id) => {
    axios
      .get("/sanctum/csrf-cookie")
      .then(() => {
        return axios.post(`/api/travels/${travel.id}/approve-guest/${user_id}`);
      })
      .then((response) => {
        console.log("Approved:", response.data);
        setParticipantsPending((prev) => prev.filter(user => user.id !== user_id));
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
        setParticipantsPending((prev) => prev.filter(user => user.id !== user_id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="container">
      {travel ? (
        <>
          <Row className="mt-3">
            <Col md={6}>
              <MapContainer center={position} zoom={5} style={{ height: '40rem', width: '100%', borderRadius: '25px' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {travel.start_location && travel.lat && travel.lon && (
                  <Marker position={[travel.lat, travel.lon]}>
                    <Popup>Start Location: {travel.start_location.city}</Popup>
                  </Marker>
                )}
                {travel.metas.map((meta, index) => (
                  <Marker key={index} position={[meta.lat, meta.lon]}>
                    <Popup>Meta: {meta.city}</Popup>
                  </Marker>
                ))}
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
            <Col md={6}>
              <h4>{travel.start_location}</h4>
              <p>Departure Date: {travel.departure_date}</p>
              <p>Expiration Date: {travel.expiration_date}</p>
              <p>Type of Moto: {travel.type_moto}</p>
              <p>CC of Moto: {travel.cc_moto}</p>
              <p>Days: {travel.days}</p>
              <p>Participanti: {activeParticipants.length}</p>

              {activeParticipants && activeParticipants.length > 0 && (
                activeParticipants.map((user, index) => (
                  <div key={index} className="d-flex mt-1 align-items-center my-2 gap-2 border rounded p-1">
                    <li className="list-group-item rounded w-100 gap-2 overflow-hidden d-flex align-items-center">
                      <img src={user.profile_img} alt="Profile" className="img_profile" />
                      <span>{user.email}</span>
                      <span>{user.pivot.role === 'creator_travel' ? '(Administrator)' : ' (Participant)'}</span>
                    </li>
                  </div>
                ))
              )}

              {authUserRole === 'creator_travel' && participantsPending.length > 0 && (
                <>
                  <p className="fw-bold mb-0 mt-3">Pending Participation Requests:</p>
                  {participantsPending.map((user, index) => (
                    <div key={index} className="d-flex mt-1 align-items-center my-2 gap-2 border rounded p-1">
                      <li className="list-group-item rounded w-100 gap-2 overflow-hidden d-flex align-items-center">
                        <img src={user.profile_img} alt="Profile" className="img_profile" />
                        <span>{user.email}</span>
                        <span>{user.pivot.role === 'creator_travel' ? '(Administrator)' : ' (Participant)'}</span>
                        <span className="text-success" onClick={() => approveGuest(user.id)}>Accetta</span>
                        <span className="text-danger" onClick={() => rejectGuest(user.id)}>Rifiuta</span>
                      </li>
                    </div>
                  ))}
                </>
              )}

              {authUserRole !== 'creator_travel' ? (
                <>
                  <Button disabled={disable} variant="success" onClick={addGuest}>Chiedi di partecipare</Button>
                  {disable && (<p className="text-success">Richiesta inviata!Attendi di essere accettato dall&apos;amministratore del viaggio</p>)}
                </>
              ) : (
                <>
                  <Button variant="danger me-2" onClick={destroy}>Elimina viaggio</Button>
                  <Button variant="warning">Modifica</Button>
                </>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <p>Loading travel details...</p>
      )}
    </div>
  );
}

export default Infotravel;
