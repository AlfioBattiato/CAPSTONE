import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, ListGroup, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const RequestsModal = ({ show, onClose }) => {
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingActions, setLoadingActions] = useState({});

  useEffect(() => {
    if (show) {
      axios
        .get(`/api/friendships/requests`)
        .then((response) => {
          setPendingRequests(response.data);
          setLoadingRequests(false);
        })
        .catch((error) => {
          console.error("Error fetching friend requests:", error);
          setLoadingRequests(false);
        });
    }
  }, [show]);

  const handleAcceptRequest = async (requestId) => {
    setLoadingActions((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(`/api/friendships/${requestId}/accept`);
      setPendingRequests((prev) => prev.filter((request) => request.id !== requestId));
      setLoadingActions((prev) => ({ ...prev, [requestId]: false }));
      alert("Richiesta di amicizia accettata!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setLoadingActions((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDeclineRequest = async (requestId) => {
    setLoadingActions((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(`/api/friendships/${requestId}/decline`);
      setPendingRequests((prev) => prev.filter((request) => request.id !== requestId));
      setLoadingActions((prev) => ({ ...prev, [requestId]: false }));
      alert("Richiesta di amicizia rifiutata!");
    } catch (error) {
      console.error("Error declining friend request:", error);
      setLoadingActions((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header className="bg-black text-white">
        <Modal.Title>Richieste di amicizia</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loadingRequests ? (
          <Spinner animation="border" />
        ) : pendingRequests.length > 0 ? (
          <ListGroup className="custom-scrollbar" style={{ maxHeight: "300px" }}>
            {pendingRequests.map((request) => (
              <ListGroup.Item key={request.id} className="d-flex justify-content-between align-items-center">
                <Link
                  to={`/profile/${request.requester.id}`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <Image
                      src={request.requester.profile_img || "path/to/default-profile-image.jpg"}
                      roundedCircle
                      style={{ width: "40px", height: "40px" }}
                    />
                    <p
                      className="text-change mb-0"
                      style={{
                        textDecoration: "none",
                        fontSize: "1.2rem",
                        marginLeft: "2rem",
                      }}
                    >
                      {request.requester.username}
                    </p>
                  </div>
                </Link>
                <div>
                  <Button
                    size="sm"
                    className="ms-2 gradient-orange border-0 rounded-pill"
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={loadingActions[request.id]}
                  >
                    {loadingActions[request.id] ? <Spinner as="span" animation="border" size="sm" /> : "Accetta"}
                  </Button>
                  <Button
                    size="sm"
                    className="ms-2 gradient-orange border-0 rounded-pill"
                    onClick={() => handleDeclineRequest(request.id)}
                    disabled={loadingActions[request.id]}
                  >
                    {loadingActions[request.id] ? <Spinner as="span" animation="border" size="sm" /> : "Rifiuta"}
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Nessuna richiesta di amicizia in sospeso.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className="gradient-orange border-0" onClick={onClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestsModal;
