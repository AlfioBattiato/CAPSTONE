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
      axios
        .get(`/api/users/${userId}/friends`)
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

  const handleVisitProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header className="bg-black text-white">
        <Modal.Title>I miei amici</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loadingFriends ? (
          <Spinner animation="border" />
        ) : friends.length > 0 ? (
          <ListGroup className="custom-scrollbar" style={{ maxHeight: "300px" }}>
            {friends.map((friend) => (
              <ListGroup.Item key={friend.id} className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Image
                    src={friend.profile_img || "path/to/default-profile-image.jpg"}
                    roundedCircle
                    style={{ width: "40px", height: "40px" }}
                  />
                  <p
                    className="mb-0"
                    style={{
                      textDecoration: "none",
                      fontSize: "1.2rem",
                      marginLeft: "2rem",
                    }}
                  >
                    {friend.username}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="ms-2 gradient-orange border-0 rounded-pill"
                  onClick={() => handleVisitProfile(friend.id)}
                >
                  Visita il Profilo
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Nessun amico trovato.</p>
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

export default FriendsModal;
