import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Button, ListGroup, Image, Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../../redux/actions";

const CreateGroupModal = ({ show, handleClose }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats.chats);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    axios
      .get(`/api/users/${user.id}/friends`)
      .then((response) => {
        setFriends(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch friends", error);
      });
  }, [user.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        setErrorMessage("Tipo di file non supportato. Si prega di caricare un'immagine JPEG o PNG.");
        setSelectedImage(null);
        setImagePreview(null);
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage(null);
    }
  };

  const handleFriendSelect = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();

    if (groupName.trim() === "") {
      setErrorMessage("Il nome del gruppo è obbligatorio.");
      return;
    }

    if (selectedFriends.length === 0) {
      setErrorMessage("Seleziona almeno un amico per creare un gruppo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("type", "group");
    selectedFriends.forEach((friendId, index) => {
      formData.append(`user_ids[${index}]`, friendId);
    });
    formData.append(`user_ids[${selectedFriends.length}]`, user.id);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    axios
      .post("/api/chats/group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        dispatch(setChats([...chats, response.data]));
        handleClose();
        setGroupName("");
        setSelectedImage(null);
        setImagePreview(null);
        setSelectedFriends([]);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error("Failed to create group", error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crea Nuovo Gruppo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleCreateGroup}>
          <div className="d-flex align-items-center mb-3">
            <div
              className="border rounded-circle overflow-hidden"
              style={{ width: "100px", height: "100px", margin: "0 auto", cursor: "pointer" }}
              onClick={() => fileInputRef.current.click()}
            >
              <Image
                src={imagePreview || "default-profile-image-url"}
                alt="group_img"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Nome Gruppo</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Inserisci nome gruppo"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Seleziona Amici</Form.Label>
            <ListGroup>
              {friends.map((friend) => (
                <ListGroup.Item
                  key={friend.id}
                  className={`d-flex justify-content-between align-items-center ${
                    selectedFriends.includes(friend.id) ? "selected-friend" : ""
                  }`}
                  onClick={() => handleFriendSelect(friend.id)}
                >
                  <div className="d-flex align-items-center">
                    <Image
                      src={friend.profile_img || "path/to/default-profile-image.jpg"}
                      roundedCircle
                      style={{ width: "40px", height: "40px", marginRight: "10px" }}
                    />
                    <span>{friend.username}</span>
                  </div>
                  <Button variant={selectedFriends.includes(friend.id) ? "danger" : "primary"}>
                    {selectedFriends.includes(friend.id) ? "Rimuovi" : "Inserisci"}
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Annulla
            </Button>
            <Button variant="primary" type="submit">
              Crea
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGroupModal;
