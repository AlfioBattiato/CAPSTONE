import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import Message from "./Message";

const Chat = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (chat && chat.id) {
      axios.get(`/api/chats/${chat.id}/messages`).then((response) => {
        setMessages(response.data);
      });
    }
  }, [chat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    try {
      const response = await axios.post(`/api/messages`, {
        chat_id: chat.id,
        message: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (!chat) {
    return <div>Please select a chat</div>;
  }

  return (
    <Card className="h-100">
      <Card.Header>{chat.name || `Chat with ${chat.users.map((user) => user.username).join(", ")}`}</Card.Header>
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </ListGroup>
      <Card.Footer>
        <Form onSubmit={handleSendMessage}>
          <Form.Group controlId="messageInput">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">
            Send
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default Chat;
