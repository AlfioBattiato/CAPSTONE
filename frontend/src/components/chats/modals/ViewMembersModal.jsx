import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, ListGroup, Image, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewMembersModal = ({ show, handleClose, chatId }) => {
  const [members, setMembers] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState({});
  const loggedInUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      axios
        .get(`/api/chats/${chatId}`)
        .then((response) => {
          setMembers(response.data.users);
        })
        .catch((error) => {
          console.error("Failed to fetch members", error);
        });
    }
  }, [show, chatId]);

  const sendFriendRequest = async (friendId) => {
    try {
      setLoadingRequests((prev) => ({ ...prev, [friendId]: true }));
      await axios.post("/api/friendships/send", { addressee_id: friendId });
      alert("Richiesta di amicizia inviata!");
      setLoadingRequests((prev) => ({ ...prev, [friendId]: false }));
      setFriendshipStatuses((prev) => ({ ...prev, [friendId]: "pending" }));
    } catch (error) {
      console.error("Error sending friend request:", error);
      setLoadingRequests((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  const checkFriendshipStatus = async (friendId) => {
    try {
      const response = await axios.post("/api/friendships/status", {
        user_id: loggedInUser.id,
        friend_id: friendId,
      });
      return response.data.status;
    } catch (error) {
      console.error("Error checking friendship status:", error);
      return null;
    }
  };

  const [friendshipStatuses, setFriendshipStatuses] = useState({});

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = {};
      for (const member of members) {
        const status = await checkFriendshipStatus(member.id);
        statuses[member.id] = status;
      }
      setFriendshipStatuses(statuses);
    };
    if (members.length > 0) {
      fetchStatuses();
    }
  }, [members]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header className="bg-black text-white">
        <Modal.Title>Membri del Gruppo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup className="custom-scrollbar" style={{ maxHeight: "200px" }}>
          {members.map((member) => (
            <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Image src={member.profile_img || "default-profile-image-url"} roundedCircle width={45} height={45} />
                <span className="ms-3 fs-5">{member.username}</span>
              </div>
              <div className="d-flex">
                <Button
                  size="sm"
                  className="ms-2 gradient-orange border-0 rounded-pill"
                  onClick={() => navigate(`/profile/${member.id}`)}
                >
                  Visita il Profilo
                </Button>
                {loggedInUser.id !== member.id && !friendshipStatuses[member.id] && !loadingRequests[member.id] && (
                  <Button
                    size="sm"
                    className="ms-2 black-white-button border-black border-2 rounded-pill"
                    onClick={() => sendFriendRequest(member.id)}
                  >
                    Aggiungi Amico
                  </Button>
                )}
                {loadingRequests[member.id] && (
                  <Spinner animation="border" role="status" size="sm" className="ms-2">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button className="gradient-orange border-0" onClick={handleClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewMembersModal;
