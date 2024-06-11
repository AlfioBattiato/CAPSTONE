import React from "react";
import { Card } from "react-bootstrap";

const Message = ({ message }) => {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>{message.user.username}</Card.Title>
        <Card.Text>{message.message}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Message;
