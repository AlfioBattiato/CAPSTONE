import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, ListGroup, Form, Button, Col } from "react-bootstrap";
import Message from "./Message";
import { MdAttachFile } from "react-icons/md";
import AudioRecorder from "./AudioRecorder";

const Chat = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/api/chats/${chat.id}/messages`)
      .then((response) => {
        console.log("Loaded messages:", response.data);
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });
  }, [chat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("chat_id", chat.id);
    formData.append("message", newMessage);
    if (file) {
      formData.append("file", file);
    }

    console.log("Sending message:", {
      chat_id: chat.id,
      message: newMessage,
      file: file ? file.name : "No file",
    });

    try {
      const response = await axios.post("/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Sent message:", response.data);
      setMessages([...messages, response.data]);
      setNewMessage("");
      setFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleAudioRecorded = (audioBlob) => {
    const formData = new FormData();
    formData.append("chat_id", chat.id);
    formData.append("file", audioBlob, "recording.wav");

    axios
      .post("/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Sent audio message:", response.data);
        setMessages([...messages, response.data]);
      })
      .catch((error) => {
        console.error("Failed to send audio message:", error);
      });
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter((message) => message.id !== messageId));
  };

  const otherUser = chat.users?.find((user) => user.id !== chat.pivot.user_id);

  return (
    <Card
      variant="flush"
      className="d-flex flex-column"
      style={{ height: "90vh", maxHeight: "90vh", backgroundColor: "#FFF", color: "#000" }}
    >
      <Card.Header className="bg-blue text-white fs-2 d-flex align-items-center border-bottom rounded-0">
        {otherUser && (
          <img
            src={otherUser.profile_img}
            alt="Profile"
            className="rounded-circle me-3"
            style={{ width: "40px", height: "40px" }}
          />
        )}
        {chat.name ||
          (chat.users && chat.users.length === 1
            ? chat.users[0].username
            : chat.users
            ? chat.users
                .filter((user) => user.id !== chat.pivot.user_id)
                .map((user) => user.username)
                .join(", ")
            : "Chat with no users")}
      </Card.Header>
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-2 custom-scrollbar">
        {messages.map((message) => (
          <Message key={message.id} message={message} onDelete={handleDeleteMessage} />
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
      <Card.Footer className="bg-blue text-white">
        <Form onSubmit={handleSendMessage} className="w-100">
          <Form.Group controlId="messageInput" className="d-flex align-items-center">
            <Col xs={8} md={9} xl={11} className="p-1">
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="rounded-pill"
                style={{ backgroundColor: "#FFF", color: "#000" }}
              />
            </Col>
            <Col xs={4} md={3} xl={1} className="p-1 d-flex align-items-center justify-content-around">
              <label htmlFor="fileInput" className="mb-0 d-flex align-items-center fs-3">
                <MdAttachFile style={{ color: "#FFF", cursor: "pointer" }} />
                <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} className="d-none" />
              </label>

              <AudioRecorder onAudioRecorded={handleAudioRecorded} />

              <Button
                variant="light"
                type="submit"
                className="d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#CC0000", borderColor: "#CC0000", height: "38px" }}
                disabled={!newMessage.trim() && !file}
              >
                <p style={{ color: "#FFF" }} className="m-0 fs-5">
                  Invia
                </p>
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default Chat;
