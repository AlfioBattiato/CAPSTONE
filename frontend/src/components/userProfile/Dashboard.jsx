import React, { useState, useRef } from "react";
import axios from "axios";
import { Container, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { LOGIN } from "../../redux/actions";
import { FaPencil } from "react-icons/fa6";

function Dashboard({ onProfileImageUpdate }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const fileInputRef = useRef(null);

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
        .post(`/api/users/${user.id}/update-profile-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          dispatch({
            type: LOGIN,
            payload: response.data,
          });
          if (onProfileImageUpdate) {
            onProfileImageUpdate(response.data);
          }
        })
        .catch((error) => {
          console.error("Error updating profile image:", error);
        });
    }
  };

  return (
    <Container className="pt-2">
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="py-5 px-4 w-100">
        <Col xs={12} md={4} className="text-center pe-5">
          <div
            className="position-relative border rounded-circle overflow-hidden"
            style={{ width: "200px", height: "200px", margin: "0 auto", cursor: "pointer" }}
            onClick={() => fileInputRef.current.click()}
          >
            <img src={user.profile_img} alt="profile_img" className="w-100 h-100" style={{ objectFit: "cover" }} />
            <div className="overlay">
              <FaPencil className="text-black" style={{ fontSize: "1.5rem" }} />
            </div>
          </div>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
        </Col>
        <Col xs={12} md={8} className="ps-4">
          <Row>
            <Col xs={6}>
              <p className="fw-bold">
                User: <span className="text-dark">{user.username}</span>
              </p>
            </Col>
            <Col xs={6} className="text-end">
              <Button variant="link" className="fw-bold text-change p-0">
                Change
              </Button>
            </Col>
            <hr className="w-100" />
            <Col xs={6}>
              <p className="fw-bold">
                Email: <span className="text-dark">{user.email}</span>
              </p>
            </Col>
            <Col xs={6} className="text-end">
              <Button variant="link" className="fw-bold text-change p-0">
                Change
              </Button>
            </Col>
            <hr className="w-100" />
            <Col xs={6}>
              <p className="fw-bold">
                Password: <span className="text-dark">************</span>
              </p>
            </Col>
            <Col xs={6} className="text-end">
              {spinner ? (
                <Spinner animation="grow" size="sm" />
              ) : (
                <Button variant="link" className="fw-bold text-change p-0" onClick={handleResetPassword}>
                  Change
                </Button>
              )}
            </Col>
            <hr className="w-100" />
            <Col xs={12}>
              <p className="fw-bold">
                Created at: <span className="text-dark">{user.created_at.slice(0, 10)}</span>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
