import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const Message = ({ message, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Controlla se l'utente loggato è il mittente del messaggio
  const isOwnMessage = message.users && message.users.some((u) => u.pivot.sender && u.id === user.id);

  // Trova l'utente mittente
  const sender = message.users && message.users.find((u) => u.pivot.sender);
  const senderName = isOwnMessage ? "You" : sender ? sender.username : "Unknown User";

  const handleDelete = () => {
    onDelete(message.id);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <ListGroup.Item
      className={`message-item px-5 py-4 d-flex bg-light border-0 ${
        isOwnMessage ? "justify-content-end" : "justify-content-start"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`message-content d-inline-block px-4 py-3 rounded-4 ${isOwnMessage ? "own-message" : ""}`}>
        <div className="message-header">
          <strong className="message-username">{senderName}</strong>
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
        <div>{message.message}</div>
        <div className="message-time">{formatTime(message.created_at)}</div>
      </div>
    </ListGroup.Item>
  );
};

export default Message;
