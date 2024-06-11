import React from "react";
import { ListGroup } from "react-bootstrap";

const Message = ({ message }) => {
  console.log(message);
  const username = message.user ? message.user.username : "Unknown User";

  return (
    <ListGroup.Item>
      <strong>{username}</strong>: {message.message}
    </ListGroup.Item>
  );
};

export default Message;
