import React from "react";
import { ListGroup } from "react-bootstrap";
import Message from "./Message";

const MessageList = ({ messages, onDelete, onMarkAsRead, messagesEndRef }) => {
  return (
    <ListGroup className="flex-grow-1 overflow-auto custom-scrollbar">
      {messages.map((message) => (
        <Message key={message.id} message={message} onDelete={onDelete} onMarkAsRead={onMarkAsRead} />
      ))}
      <div ref={messagesEndRef} />
    </ListGroup>
  );
};

export default MessageList;
