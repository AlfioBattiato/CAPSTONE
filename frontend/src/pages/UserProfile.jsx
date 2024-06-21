import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Button, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { LOGIN } from "../redux/actions";

const UserProfile = () => {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [profileUser, setProfileUser] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [travels, setTravels] = useState([]);
  const [loadingTravels, setLoadingTravels] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((response) => {
        setProfileUser(response.data);
        setEmail(response.data.email);
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

  const handleResetPassword = () => {
    setSpinner(true);
    axios
      .post("/api/forgot-password", { email })
      .then((res) => {
        setMessage(res.data.status);
        setSpinner(false);
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        setMessage(null);
        setError(err.response.data.message);
        setSpinner(false);
      });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_img", file);

      axios
        .post(`/api/users/${profileUser.id}/update-profile-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setProfileUser(response.data);
          if (profileUser.id === loggedInUser.id) {
            dispatch({
              type: LOGIN,
              payload: response.data,
            });
          }
        })
        .catch((error) => {
          console.error("Error updating profile image:", error);
        });
    }
  };

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  const isOwner = loggedInUser && profileUser.id === loggedInUser.id;
  const currentDate = new Date().toISOString().split("T")[0]; // Data corrente in formato YYYY-MM-DD

  const activeTravels = travels.filter((travel) => travel.active && travel.expiration_date >= currentDate);
  const inactiveTravels = travels.filter((travel) => !travel.active || travel.expiration_date < currentDate);

  return (
    <Container className="mt-5">
      <Row className="align-items-center">
        <Col md={3} className="text-center">
          {profileUser.profile_img && (
            <img
              src={profileUser.profile_img}
              alt="Profile"
              className="img-fluid rounded-circle border object-fit-sm-contain"
              style={{ width: "150px", height: "150px", cursor: isOwner ? "pointer" : "default" }}
              onClick={isOwner ? () => fileInputRef.current.click() : null}
            />
          )}
          {isOwner && <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />}
        </Col>
        <Col md={9}>
          {isOwner ? (
            <Row>
              <Col xs={6}>
                <p className="fw-bold">
                  User: <span className="text-dark">{profileUser.username}</span>
                </p>
              </Col>
              <Col xs={6}>
                <Button variant="link" className="fw-bold text-primary p-0">
                  Change
                </Button>
              </Col>
              <hr />
              <Col xs={6}>
                <p className="fw-bold">
                  Email: <span className="text-dark">{profileUser.email}</span>
                </p>
              </Col>
              <Col xs={6}>
                <Button variant="link" className="fw-bold text-primary p-0">
                  Change
                </Button>
              </Col>
              <hr />
              <Col xs={6}>
                <p className="fw-bold">
                  Password: <span className="text-dark">************</span>
                </p>
              </Col>
              <Col xs={6}>
                {spinner ? (
                  <Spinner animation="grow" size="sm" />
                ) : (
                  <Button variant="link" className="fw-bold text-primary p-0" onClick={handleResetPassword}>
                    Change
                  </Button>
                )}
              </Col>
              <hr />
              <Col xs={6}>
                <p className="fw-bold">
                  Created at: <span className="text-dark">{profileUser.created_at.slice(0, 10)}</span>
                </p>
              </Col>
              <hr />
            </Row>
          ) : (
            <h3>{profileUser.username}</h3>
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
    </Container>
  );
};

export default UserProfile;
