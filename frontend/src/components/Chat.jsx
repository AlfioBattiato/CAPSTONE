import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, ListGroup, Form, Button, Col, Row } from "react-bootstrap";
import Message from "./Message";
import { MdAttachFile } from "react-icons/md";
import { GrSend } from "react-icons/gr";

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

  return (
    <Card className="h-100 d-flex flex-column " style={{ height: "100vh" }}>
      <Card.Header>
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
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto p-2">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
      <Card.Footer className="mt-auto">
        <Form onSubmit={handleSendMessage}>
          <Form.Group controlId="messageInput" className="d-flex align-items-center">
            <Row className="w-100 align-tems-center">
              <Col xs={9} md={10} className="p-1">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="me-2 rounded-pill"
                />
              </Col>
              <Col xs={3} md={2} className="d-flex">
                <label htmlFor="fileInput" className="me-2">
                  <span className="fs-3 mb-2"><MdAttachFile /></span>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="d-none"
                  />

                </label>
                <Button variant="light" type="submit" className="rounded-pill">
                  Invia
                </Button>
              </Col>
            </Row>

          </Form.Group>

        </Form>
      </Card.Footer>
    </Card>
  );
};

export default Chat;
