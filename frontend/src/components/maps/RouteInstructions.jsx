import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, ListGroup } from "react-bootstrap";
import { setExpiration } from "../../redux/actions";

const RouteInstructions = () => {
  const travel = useSelector((state) => state.infotravels.setTravel);
  const dispatch = useDispatch();
  const map_instructions = useSelector((state) => state.infotravels.map_instructions);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateExpirationDate = (departure_date, totalTime) => {
    const startDateTime = new Date(departure_date);
    const totalHours = totalTime / 3600;
    const days = Math.ceil(totalHours / 24);
    startDateTime.setDate(startDateTime.getDate() + days - 1); // -1 to account for the start day
    return startDateTime;
  };

  const calculateDay = () => {
    if (map_instructions && map_instructions.summary && travel.departure_date) {
      const totalTime = map_instructions.summary.totalTime;
      const days = Math.ceil(totalTime / (24 * 3600));
      const expirationDate = calculateExpirationDate(travel.departure_date, totalTime);

      const updatedTravel = {

        days: days,
        expiration_date: expirationDate, //.toISOString().split('T')[0] Format as YYYY-MM-DD
      };

      // Dispatch the updated travel information
      dispatch(setExpiration(updatedTravel));
    }
  };

  useEffect(() => {
    calculateDay();
  }, [map_instructions, travel.departure_date, dispatch]);

  return (
    <div className="bg-white rounded p-3 shadow" style={{ overflow: 'hidden' }}>
      {map_instructions && map_instructions.instructions ? (
        <React.Fragment>
          <p className="fw-bold">Istruzioni</p>
          <div className="d-flex flex-wrap justify-content-between">
            <p className="mb-0">Distanza totale:</p>
            <Badge bg="primary">{(map_instructions.summary.totalDistance / 1000).toFixed(2)} km</Badge>


          </div>
          <div className="mt-2 d-flex flex-wrap justify-content-between">
            <p className="mb-0">Tempo totale: </p>
            <Badge bg="success">{formatTime(map_instructions.summary.totalTime)}</Badge>


          </div>
          <hr />
          <p className="fw-bold">Autostrade:</p>
          <p>{map_instructions.name}</p>
          <hr />
          <ListGroup style={{ maxHeight: "19.2rem", overflowY: "auto", }}>
            <p className="fw-bold">Percorso:</p>
            {map_instructions.instructions.map((instruction, index) => (
              <ListGroup.Item key={index} className="bg-dark text-white">
                {instruction.text}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </React.Fragment>
      ) : (
        <p>Nessuna istruzione disponibile.</p>
      )}
    </div>
  );
};

export default RouteInstructions;
