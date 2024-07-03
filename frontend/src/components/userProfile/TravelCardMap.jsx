import React from "react";
import Badge from "react-bootstrap/Badge";
import { BsFillPeopleFill, BsCalendarDate } from "react-icons/bs";
import { SiGooglemaps } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import MapImage from "./MapImage";
import { Col, Row } from "react-bootstrap";

export default function TravelCardMap({ travel, showParticipants, nobutton }) {
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

  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const participantsCount = travel.users
    ? travel.users.filter((user) => user.pivot && user.pivot.active === 1).length
    : 0;

  return (
    <div
      className="cardTravel position-relative overflow-hidden m-1 my-5 m-md-3 m-lg-5"
      style={{ backgroundImage: `url(${getImageSource(travel.type_moto)})` }}
    >
      {travel && (
        <>
          <Row>
            <Col xs={12} sm={6} md={5} lg={4} xxl={3} className="p-0">
              <MapImage travel={travel} metas={travel.metas} />
            </Col>
            <Col xs={12} sm={6} md={7} lg={8} xxl={9} className="cardTravel_body">
              <div className=" pe-3 ps-2 py-3 h-100">
                <div className="d-flex gap-2 align-items-center mb-3">
                  <SiGooglemaps className="text-danger icon-travelcardmap" />
                  <p className="fw-semibold mb-0 font-city">{travel.start_location}</p>
                </div>
                <div className="d-flex flex-sm-column align-travelcardmap mt-2 gap-1">
                  <div className="d-flex flex-wrap gap-2">
                    <BsCalendarDate className="me-1" />
                    <p className="fs-12 fw-bold me-2 mb-0">{formatDate(travel.departure_date)}</p>
                  </div>

                  <div>
                    <Badge bg="dark" text="white" className="badgecard">
                      {travel.type_moto}
                    </Badge>
                  </div>
                  <div>
                    <Badge bg="dark" text="white" className="badgecard">
                      Cc: {travel.cc_moto}
                    </Badge>
                  </div>
                </div>

                {showParticipants && (
                  <>
                    <p className="m-0 fs-12 text-secondary">Partecipanti attuali:</p>
                    <BsFillPeopleFill className="me-2 text-success" />
                    <Badge bg="light" text="dark">
                      {participantsCount}
                    </Badge>
                  </>
                )}
              </div>
            </Col>
          </Row>
          {!nobutton && (
            <button className="cardTravel-button" onClick={() => navigate(`/infoTravel/${travel.id}`)}>
              Vedi
            </button>
          )}
        </>
      )}
    </div>
  );
}
