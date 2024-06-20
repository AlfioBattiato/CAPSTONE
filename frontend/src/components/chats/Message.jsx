import React, { useState } from "react";
import { ListGroup, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const Message = ({ message, onDelete, onMarkAsRead }) => {
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isOwnMessage = user.id === message.user_id;

  const handleDelete = () => {
    onDelete(message.id);
  };

  return (
    <ListGroup.Item
      className={`message-item px-5 py-4 d-flex border-0 ${
        isOwnMessage ? "justify-content-end" : "justify-content-start"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`message-content d-inline-block px-4 py-3 border-0 rounded-4 ${isOwnMessage ? "own-message" : ""}`}
      >
        <div className="message-header">
          <strong className="message-username fs-6">{message.user?.username || "Unknown User"}</strong>
          {isOwnMessage && isHovered && (
            <button className="message-delete-button" onClick={handleDelete}>
              &times;
            </button>
          )}
        </div>
        {message.file_url && (
          <div className="message-attachment my-1">
            {message.file_type.startsWith("image/") && <img src={message.file_url} alt="Attachment" />}
            {message.file_type.startsWith("video/") && (
              <video controls>
                <source src={message.file_url} type={message.file_type} />
              </video>
            )}
            {message.file_type.startsWith("audio/") && (
              <audio controls>
                <source src={message.file_url} type={message.file_type} />
              </audio>
            )}
          </div>
        )}
        <div className="fs-5">{message.message}</div>
      </div>
    </ListGroup.Item>
  );
};

export default Message;
