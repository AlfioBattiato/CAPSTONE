import React from "react";
import { ListGroup } from "react-bootstrap";

const Message = ({ message }) => {
  return (
    <ListGroup.Item>
      <strong>{message.user.username}:</strong> {message.message}
      {message.file && (
        <div>
          <a href={`data:${message.file_type};base64,${message.file}`} download>
            Download File
          </a>
        </div>
      )}
    </ListGroup.Item>
  );
};

export default Message;
