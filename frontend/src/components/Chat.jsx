import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import Message from "./Message";

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
    <Card className="h-100 d-flex flex-column" style={{ height: "100vh" }}>
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
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </ListGroup>
      <Card.Footer className="mt-auto">
        <Form onSubmit={handleSendMessage}>
          <Form.Group controlId="messageInput" className="d-flex">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="me-2"
            />
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} className="me-2" />
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form.Group>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default Chat;
