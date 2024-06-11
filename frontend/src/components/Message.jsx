import React from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const user = useSelector((state) => state.auth.user);
  const isOwnMessage = user.id === message.user_id;

  return (
    <ListGroup.Item className={`d-flex ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}>
      <div>
        <strong>{message.user?.username || "Unknown User"}:</strong> {message.message}
      </div>
    </ListGroup.Item>
  );
};

export default Message;
