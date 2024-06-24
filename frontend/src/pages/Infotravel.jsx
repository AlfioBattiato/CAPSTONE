import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import RoutingMachine from '../components/maps/RoutingMachine';
import { useDispatch } from "react-redux";

function Infotravel() {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [authUserRole, setAuthUserRole] = useState(null);
  const[position,setPosition]=useState([0,0])
  const dispatch=useDispatch()
  const [key, setKey] = useState(0); // Informazioni per il popup


  useEffect(() => {
    axios
      .get(`/api/travel/${id}`)
      .then((response) => {
        console.log(response.data);
        setTravel(response.data);
        setPosition([response.data.lat,response.data.lon])
        setAuthUserRole(response.data.auth_user_role);
        setKey(oldKey => oldKey + 1);
      })
      .catch((error) => {
        console.error("Error fetching travel:", error);
      });
  }, [id,]);

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
                travel.lon&&(
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


            </Col>
          </Row>













          {authUserRole === 'creator_travel' && (
            <div>
              <button>Approve Guest</button>
              <button>Reject Guest</button>
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
