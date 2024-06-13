import React from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const user = useSelector((state) => state.auth.user);
  const isOwnMessage = user.id === message.user_id;

  return (
    <ListGroup.Item
      className={`px-3 py-2 d-flex ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
      style={{
        border: "none",
        background: "transparent",
      }}
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
          transform: "translateY(-2px)",
        }}
      >
        <strong>{message.user?.username || "Unknown User"}:</strong>
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
              <audio controls>
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
