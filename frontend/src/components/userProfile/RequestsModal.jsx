import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, ListGroup, Image } from "react-bootstrap";
import axios from "axios";

const RequestsModal = ({ show, onClose }) => {
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);

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
    try {
      await axios.post(`/api/friendships/${requestId}/accept`);
      setPendingRequests(pendingRequests.filter((request) => request.id !== requestId));
      alert("Richiesta di amicizia accettata!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await axios.post(`/api/friendships/${requestId}/decline`);
      setPendingRequests(pendingRequests.filter((request) => request.id !== requestId));
      alert("Richiesta di amicizia rifiutata!");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Richieste di amicizia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingRequests ? (
          <Spinner animation="border" />
        ) : pendingRequests.length > 0 ? (
          <ListGroup>
            {pendingRequests.map((request) => (
              <ListGroup.Item key={request.id}>
                <Image
                  src={request.requester.profile_img || "path/to/default-profile-image.jpg"}
                  roundedCircle
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                <span>{request.requester.username}</span>
                <Button variant="success" size="sm" className="ms-2" onClick={() => handleAcceptRequest(request.id)}>
                  Accetta
                </Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeclineRequest(request.id)}>
                  Rifiuta
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Nessuna richiesta di amicizia in sospeso.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestsModal;
