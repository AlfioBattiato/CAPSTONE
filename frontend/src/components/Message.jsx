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
        {message.file_url && (
          <div>
            {message.file_type.startsWith("image/") && (
              <img src={message.file_url} alt="Attachment" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            )}
            {message.file_type.startsWith("video/") && (
              <video controls style={{ maxWidth: "200px", maxHeight: "200px" }}>
                <source src={message.file_url} type={message.file_type} />
              </video>
            )}
            {message.file_type.startsWith("audio/") && (
              <audio controls>
                <source src={message.file_url} type={message.file_type} />
              </audio>
            )}
            {/* Aggiungi ulteriori controlli per altri tipi di file */}
          </div>
        )}
      </div>
    </ListGroup.Item>
  );
};

export default Message;
