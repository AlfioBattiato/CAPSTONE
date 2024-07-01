import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Image, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../../redux/actions";
import { FaPencil } from "react-icons/fa6";

const EditGroupModal = ({ show, handleClose, chat, onImageUpdate, onNameUpdate }) => {
  const [groupName, setGroupName] = useState(chat.name);
  const [newImage, setNewImage] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chats.chats);

  useEffect(() => {
    setGroupName(chat.name);
    setMembers(chat.users || []);
    setNewImage(null);
  }, [chat]);

  useEffect(() => {
    if (show) {
      setLoading(true);
      const fetchGroupData = async () => {
        try {
          const membersResponse = await axios.get(`/api/chats/${chat.id}`);
          setMembers(membersResponse.data.users);

          const friendsResponse = await axios.get(`/api/users/${user.id}/friends`);
          const filteredFriends = friendsResponse.data.filter(
            (friend) => !membersResponse.data.users.some((member) => member.id === friend.id)
          );
          setFriends(filteredFriends);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch data", error);
          setLoading(false);
        }
      };

      fetchGroupData();
    }
  }, [show, user.id, chat.id]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleFriendSelect = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", groupName);
    selectedFriends.forEach((id, index) => {
      formData.append(`user_ids[${index}]`, id);
    });
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await axios.post(`/api/chats/group/${chat.id}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setChats(chats.map((c) => (c.id === chat.id ? response.data : c))));
      onNameUpdate(response.data.name);
      if (newImage) {
        onImageUpdate(response.data.image);
      }
      handleClose();
    } catch (error) {
      console.error("Failed to update group", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header className="bg-black text-white">
        <Modal.Title>Modifica Gruppo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleUpdateGroup}>
          <Row className="mt-4 d-flex align-items-center">
            <Col xs={12} md={4} className="d-flex align-items-center">
              <div
                className="position-relative border rounded-circle overflow-hidden"
                style={{ width: "200px", height: "200px", margin: "0 auto", cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={newImage ? URL.createObjectURL(newImage) : chat.image}
                  alt="group_img"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
                <div className="overlay">
                  <FaPencil className="text-black" style={{ fontSize: "1.5rem" }} />
                </div>
              </div>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
            </Col>
            <Col xs={12} md={8}>
              <Form.Group className="mb-5">
                <Form.Label>Nome del gruppo</Form.Label>
                <Form.Control
                  type="text"
                  className="search-input"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Inserisci nuovo nome"
                />
              </Form.Group>
              {loading ? (
                <div className="d-flex justify-content-center my-3">
                  <Spinner animation="border" />
                </div>
              ) : friends.length > 0 ? (
                <Form.Group className="mb-3">
                  <Form.Label>Aggiungi amici</Form.Label>
                  <div className="d-flex flex-column custom-scrollbar" style={{ maxHeight: "200px" }}>
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className={`friend-item d-flex justify-content-between align-items-center p-2 border rounded ${
                          selectedFriends.includes(friend.id) ? "bg-black text-white" : ""
                        }`}
                        onClick={() => handleFriendSelect(friend.id)}
                      >
                        <div className="d-flex align-items-center">
                          <Image
                            src={friend.profile_img || "default-profile-image-url"}
                            roundedCircle
                            style={{ width: "40px", height: "40px", marginRight: "10px" }}
                          />
                          <span className="ms-2">{friend.username}</span>
                        </div>
                        <Button
                          className={`ms-2 border-0 rounded-pill ${
                            selectedFriends.includes(friend.id) ? "black-white-button" : "gradient-orange"
                          }`}
                        >
                          {selectedFriends.includes(friend.id) ? "Rimuovi" : "Inserisci"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Form.Group>
              ) : (
                <p>Nessun amico disponibile da aggiungere.</p>
              )}
            </Col>
          </Row>
          <div className="text-end">
            <Button className="gradient-orange border-0 mt-3" type="submit">
              Salva
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditGroupModal;
