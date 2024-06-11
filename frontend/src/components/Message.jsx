import React from "react";
import { ListGroup } from "react-bootstrap";

const Message = ({ message }) => {
  return (
    <ListGroup.Item>
      <strong>{message.user.username}:</strong> {message.message}
    </ListGroup.Item>
  );
};

export default Message;
