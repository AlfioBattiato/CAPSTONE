import React, { useState, useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

const Message = ({ message, onDelete, onMarkAsRead }) => {
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isOwnMessage = user.id === message.user_id;

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/messages/${message.id}`);
      onDelete(message.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <ListGroup.Item
      className={`px-3 py-2 d-flex ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
      style={{
        border: "none",
        background: "transparent",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="d-inline-block px-3 py-2"
        style={{
          maxWidth: "70%",
          background: isOwnMessage ? "#CC0000" : "#05203C",
          color: "#FFF",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <strong className="pe-2 pb-2">{message.user?.username || "Unknown User"}</strong>
          {isOwnMessage && isHovered && (
            <Button
              variant="transparent"
              className="text-white"
              size="sm"
              onClick={handleDelete}
              style={{ borderRadius: "50%" }}
            >
              &times;
            </Button>
          )}
        </div>
        {message.file_url && (
          <div className="my-1">
            {message.file_type.startsWith("image/") && (
              <img src={message.file_url} alt="Attachment" style={{ maxWidth: "400px", maxHeight: "400px" }} />
            )}
            {message.file_type.startsWith("video/") && (
              <video controls style={{ maxWidth: "400px", maxHeight: "400px" }}>
                <source src={message.file_url} type={message.file_type} />
              </video>
            )}
            {message.file_type.startsWith("audio/") && (
              <audio controls style={{ maxWidth: "400px", maxHeight: "400px" }}>
                <source src={message.file_url} type={message.file_type} />
              </audio>
            )}
          </div>
        )}
        <div>{message.message}</div>
      </div>
    </ListGroup.Item>
  );
};

export default Message;
