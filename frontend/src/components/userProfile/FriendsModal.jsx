import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, ListGroup, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FriendsModal = ({ show, onClose, userId }) => {
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (show && userId) {
      // Assicurati che userId sia definito prima di fare la chiamata API
      axios
        .get(`/api/users/${userId}/friends`) // Usa userId per ottenere gli amici
        .then((response) => {
          setFriends(response.data);
          setLoadingFriends(false);
        })
        .catch((error) => {
          console.error("Error fetching friends:", error);
          setLoadingFriends(false);
        });
    }
  }, [show, userId]);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>I miei amici</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingFriends ? (
          <Spinner animation="border" />
        ) : friends.length > 0 ? (
          <ListGroup>
            {friends.map((friend) => (
              <ListGroup.Item key={friend.id} action onClick={() => navigate(`/profile/${friend.id}`)}>
                <Image
                  src={friend.profile_img || "path/to/default-profile-image.jpg"}
                  roundedCircle
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                <span>{friend.username}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Nessun amico trovato.</p>
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

export default FriendsModal;
