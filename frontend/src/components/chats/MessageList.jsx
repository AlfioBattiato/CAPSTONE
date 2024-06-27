import React from "react";
import { ListGroup } from "react-bootstrap";
import Message from "./Message";

const MessageList = ({ messages, onDelete, onMarkAsRead, messagesEndRef }) => {
  let lastMessageDate = null;

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isNewDay = (currentDate, lastDate) => {
    if (!lastDate) return true;
    const current = new Date(currentDate);
    const last = new Date(lastDate);
    return current.toDateString() !== last.toDateString();
  };

  return (
    <ListGroup className="flex-grow-1 overflow-auto custom-scrollbar">
      {messages.map((message) => {
        const messageDate = new Date(message.created_at).toISOString().split("T")[0]; // Just the date part
        const showDate = isNewDay(messageDate, lastMessageDate);
        lastMessageDate = messageDate;

        return (
          <React.Fragment key={message.id}>
            {showDate && (
              <div className="message-date">
                <span className="badge bg-secondary">{formatDate(message.created_at)}</span>
              </div>
            )}
            <Message message={message} onDelete={onDelete} onMarkAsRead={onMarkAsRead} />
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </ListGroup>
  );
};

export default MessageList;
