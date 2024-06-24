import React from "react";
import { ListGroup, Badge } from "react-bootstrap";

const ChatList = ({ chats, selectedChat, onChatClick, unreadCounts }) => {
  return (
    <ListGroup className="custom-scrollbar bg-white rounded-0 border-0" style={{ height: "80vh", maxHeight: "80vh" }}>
      {Array.isArray(chats) && chats.length > 0 ? (
        chats.map((chat) => (
          <ListGroup.Item
            key={chat.id}
            onClick={() => onChatClick(chat)}
            className={`chat-item px-4 rounded-0 border-0 py-3 btn fs-4 text-start ${
              selectedChat && selectedChat.id === chat.id ? "bg-red" : "bg-blue text-white"
            }`}
            onMouseEnter={(e) => {
              if (!(selectedChat && selectedChat.id === chat.id)) {
                e.currentTarget.classList.add("bg-white");
                e.currentTarget.classList.add("text-black");
                e.currentTarget.classList.remove("bg-blue");
                e.currentTarget.classList.remove("text-white");
              }
            }}
            onMouseLeave={(e) => {
              if (!(selectedChat && selectedChat.id === chat.id)) {
                e.currentTarget.classList.remove("bg-white");
                e.currentTarget.classList.remove("text-black");
                if (selectedChat && selectedChat.id === chat.id) {
                  e.currentTarget.classList.add("bg-red");
                } else {
                  e.currentTarget.classList.add("bg-blue");
                }
                e.currentTarget.classList.add("text-white");
              }
            }}
          >
            {chat.name ||
              (chat.users && chat.users.length === 1
                ? chat.users[0].username
                : chat.users
                ? chat.users
                    .filter((user) => user.id !== chat.pivot.user_id)
                    .map((user) => user.username)
                    .join(", ")
                : "Chat with no users")}
            {unreadCounts[chat.id] > 0 && (
              <Badge bg="secondary" className="ms-2">
                {unreadCounts[chat.id]}
              </Badge>
            )}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No chats available</ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default ChatList;
