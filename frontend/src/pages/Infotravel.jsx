import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import RoutingMachine from '../components/maps/RoutingMachine';
import { useDispatch, useSelector } from "react-redux";

function Infotravel() {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [authUserRole, setAuthUserRole] = useState(null);
  const [position, setPosition] = useState([0, 0])
  const dispatch = useDispatch()
  const [key, setKey] = useState(0); // Informazioni per il popup
  const [disable, setDisable] = useState(false)
  const utenteLoggato = useSelector((state) => state.auth.user.email)
  const [activeParticipants, setActiveParticipants] = useState([])
  // const activeParticipants = travel ? travel.users.filter(user => user.pivot.active === 1).length : 0;



  useEffect(() => {
    axios
      .get(`/api/travel/${id}`)
      .then((response) => {
        console.log(response.data);
        setTravel(response.data);
        setPosition([response.data.lat, response.data.lon])
        setAuthUserRole(response.data.auth_user_role);
        setKey(oldKey => oldKey + 1);
        setActiveParticipants(response.data.users.filter(user => user.pivot.active === 1))

        // questo mi serve per disattivare la richiesta se è stata già inviata
        response.data.users.map((e) => {
          if (e.email === utenteLoggato) {
            setDisable(true)
          }
        })
      })
      .catch((error) => {
        console.error("Error fetching travel:", error);
      });
  }, [id]);
  const addGuest = () => {
    // console.log(travel);

    // Controlla se l'utente loggato è già nell'array travel.users
    const userExists = travel.users.some((user) => user.email === utenteLoggato && user.pivot.active === 0);
    if (!userExists) {
      axios
        .get("/sanctum/csrf-cookie")
        .then(() => {
          return axios.post(`/api/travels/${travel.id}/add-guest`);
        })
        .then((response) => {
          setDisable(true);
          console.log("Request sended:", response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("User is already a guest or request already sent.");
    }
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
                {
                  travel.lon && (
                    <RoutingMachine
                      lat={travel.lat}
                      lon={travel.lon}
                      metas={travel.metas}
                      key={key}
                      dispatch={dispatch}
                    />
                  )
                }
              </MapContainer>
            </Col>
            <Col md={6}>
              <h4>{travel.start_location}</h4>
              <p>Departure Date: {travel.departure_date}</p>
              <p>Expiration Date: {travel.expiration_date}</p>
              <p>Type of Moto: {travel.type_moto}</p>
              <p>CC of Moto: {travel.cc_moto}</p>
              <p>Days: {travel.days}</p>
              <p>Partecipanti attuali: {activeParticipants.length}</p>
              {authUserRole !== 'creator_travel' ? (
                <>
                  <Button disabled={disable} variant="success" onClick={addGuest}>Chiedi all&apos;organizzatore di partecipare</Button>
                  {disable && (<p className="text-success">Richiesta inviata con successo</p>)}
                </>
              ) : (
                <>
                  <Button variant="danger me-2">Elimina viaggio</Button>
                  <Button variant="warning">Modifica</Button>
                  <p className="mt-5 fw-bold">Richieste di partecipazione:</p>

                </>
              )}
            </Col>
          </Row>













          {authUserRole === 'creator_travel' && (
            <div>
              {/* Altre opzioni extra */}


            </div>
          )}
        </>
      ) : (
        <p>Loading travel details...</p>
      )}
    </div>
  );
}

export default Infotravel;
