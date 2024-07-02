import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Button, ListGroup, Image, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../../redux/actions";
import { useChannel } from "ably/react";
import { FaPencil } from "react-icons/fa6";
import DEFAULT_GROUP_IMAGE from "../../../assets/profiles/group-of-people.svg"; // Assicurati che il percorso sia corretto

const CreateGroupModal = ({ show, handleClose }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_GROUP_IMAGE);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats.chats);
  const user = useSelector((state) => state.auth.user);

  const { channel: chatListChannel } = useChannel("chat-list");

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
        setImagePreview(DEFAULT_GROUP_IMAGE);
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
        const newChat = response.data;

        dispatch(setChats([...chats, newChat]));

        // Publish to Ably channel
        chatListChannel.publish("chat.created", { chat: newChat });

        handleClose();
        setGroupName("");
        setSelectedImage(null);
        setImagePreview(DEFAULT_GROUP_IMAGE);
        setSelectedFriends([]);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error("Failed to create group", error);
        if (error.response && error.response.data && error.response.data.errors) {
          setErrorMessage(error.response.data.errors.image?.[0]);
        }
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header className="bg-black text-white">
        <Modal.Title>Crea Nuovo Gruppo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleCreateGroup}>
          <Row className="mt-4">
            <Col xs={12} lg={4} className="d-flex align-items-center">
              <div
                className="position-relative border rounded-circle overflow-hidden"
                style={{ width: "200px", height: "200px", margin: "0 auto", cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
              >
                <img src={imagePreview} alt="group_img" className="w-100 h-100" style={{ objectFit: "cover" }} />
                <div className="overlay">
                  <div className="p-2 rounded-circle bg-white">
                    <FaPencil className="text-black" style={{ fontSize: "1.5rem" }} />
                  </div>
                </div>
              </div>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
            </Col>
            <Col xs={12} lg={8}>
              <Form.Group className="mb-5">
                <Form.Label className="fw-bold">Nome Gruppo</Form.Label>
                <Form.Control
                  type="text"
                  className="search-input"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Inserisci nome gruppo"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Seleziona Amici</Form.Label>
                <ListGroup className="custom-scrollbar" style={{ maxHeight: "200px" }}>
                  {friends.map((friend) => (
                    <ListGroup.Item
                      key={friend.id}
                      className={`d-flex justify-content-between align-items-center ${
                        selectedFriends.includes(friend.id) ? "bg-black text-white" : ""
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
                      <Button
                        className={`ms-2 border-0 rounded-pill ${
                          selectedFriends.includes(friend.id) ? "black-white-button" : "gradient-orange"
                        }`}
                      >
                        {selectedFriends.includes(friend.id) ? "Rimuovi" : "Inserisci"}
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Form.Group>
            </Col>
            <Modal.Footer>
              <Button className=" black-white-button border-0" onClick={handleClose}>
                Annulla
              </Button>
              <Button className="gradient-orange border-0" type="submit">
                Crea
              </Button>
            </Modal.Footer>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGroupModal;
