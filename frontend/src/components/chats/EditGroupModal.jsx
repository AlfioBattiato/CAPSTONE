import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Image, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setChats } from "../../redux/actions";

const EditGroupModal = ({ show, handleClose, chat }) => {
  const [groupName, setGroupName] = useState(chat.name);
  const [newImage, setNewImage] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [members, setMembers] = useState(chat.users || []);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chats.chats);

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
      handleClose();
    } catch (error) {
      console.error("Failed to update group", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Gruppo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateGroup}>
          <div className="d-flex align-items-center mb-3">
            <div
              className="border rounded-circle overflow-hidden"
              style={{ width: "100px", height: "100px", margin: "0 auto", cursor: "pointer" }}
              onClick={() => fileInputRef.current.click()}
            >
              <Image
                src={newImage ? URL.createObjectURL(newImage) : chat.image}
                alt="group_img"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Nome del gruppo</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Inserisci nuovo nome"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amici</Form.Label>
            <div className="d-flex flex-column">
              {friends
                .filter((friend) => !members.some((member) => member.id === friend.id))
                .map((friend) => (
                  <div
                    key={friend.id}
                    className={`friend-item d-flex justify-content-between align-items-center p-2 border rounded ${
                      selectedFriends.includes(friend.id) ? "selected-friend" : ""
                    }`}
                    onClick={() => handleFriendSelect(friend.id)}
                  >
                    <div className="d-flex align-items-center">
                      <Image
                        src={friend.profile_img || "default-profile-image-url"}
                        roundedCircle
                        width={30}
                        height={30}
                      />
                      <span className="ms-2">{friend.username}</span>
                    </div>
                    <Button variant={selectedFriends.includes(friend.id) ? "danger" : "success"} size="sm">
                      {selectedFriends.includes(friend.id) ? "Rimuovi" : "Aggiungi"}
                    </Button>
                  </div>
                ))}
            </div>
          </Form.Group>
          <Button variant="primary" type="submit">
            Salva
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditGroupModal;
