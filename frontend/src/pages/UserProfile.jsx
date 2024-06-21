import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Button, Card, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Dashboard from "../components/userProfile/Dashboard";

const UserProfile = () => {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [profileUser, setProfileUser] = useState(null);
  const [travels, setTravels] = useState([]);
  const [loadingTravels, setLoadingTravels] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((response) => {
        setProfileUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    axios
      .get(`/api/users/${id}/travels`)
      .then((response) => {
        setTravels(response.data);
        setLoadingTravels(false);
      })
      .catch((error) => {
        console.error("Error fetching travels:", error);
        setLoadingTravels(false);
      });
  }, [id]);

  const handleProfileImageUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
  };

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  const isOwner = loggedInUser && profileUser.id === loggedInUser.id;
  const currentDate = new Date().toISOString().split("T")[0];

  const activeTravels = travels.filter((travel) => travel.active && travel.expiration_date >= currentDate);
  const inactiveTravels = travels.filter((travel) => !travel.active || travel.expiration_date < currentDate);

  return (
    <Container className="mt-5">
      <Row className="align-items-center">
        <Col md={3} className="text-center">
          <div
            className="border rounded-circle overflow-hidden"
            style={{ width: "200px", height: "200px", margin: "0 auto" }}
          >
            <img
              src={profileUser.profile_img}
              alt="profile_img"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
        </Col>
        <Col md={9}>
          <h3>{profileUser.username}</h3>
          {isOwner && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Edit Profile
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3>I miei viaggi in programma</h3>
          {loadingTravels ? (
            <Spinner animation="border" />
          ) : activeTravels.length > 0 ? (
            <Row>
              {activeTravels.map((travel, index) => (
                <Col md={4} key={`active-travel-${travel.id}-${index}`} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src="path/to/default-image.jpg" alt={travel.start_location} />
                    <Card.Body>
                      <Card.Title>{travel.start_location}</Card.Title>
                      <Card.Text>Tipo di moto: {travel.type_moto}</Card.Text>
                      <Card.Text>Data di partenza: {travel.departure_date}</Card.Text>
                      <Card.Text>Data di scadenza: {travel.expiration_date}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>Nessun viaggio trovato.</p>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3>I miei viaggi passati</h3>
          {loadingTravels ? (
            <Spinner animation="border" />
          ) : inactiveTravels.length > 0 ? (
            <Row>
              {inactiveTravels.map((travel, index) => (
                <Col md={4} key={`inactive-travel-${travel.id}-${index}`} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src="path/to/default-image.jpg" alt={travel.start_location} />
                    <Card.Body>
                      <Card.Title>{travel.start_location}</Card.Title>
                      <Card.Text>Tipo di moto: {travel.type_moto}</Card.Text>
                      <Card.Text>Data di partenza: {travel.departure_date}</Card.Text>
                      <Card.Text>Data di scadenza: {travel.expiration_date}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>Nessun viaggio trovato.</p>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dashboard onProfileImageUpdate={handleProfileImageUpdate} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
