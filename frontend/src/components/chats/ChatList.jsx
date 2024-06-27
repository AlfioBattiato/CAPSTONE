import React from "react";
import { ListGroup, Badge, Image } from "react-bootstrap";

const ChatList = ({ chats, selectedChat, onChatClick, unreadCounts }) => {
  return (
    <ListGroup className="custom-scrollbar bg-light rounded-0 border-0 chat-list">
      {Array.isArray(chats) && chats.length > 0 ? (
        chats.map((chat) => {
          const otherUsers = chat.users.filter((user) => user.id !== chat.pivot.user_id);
          let chatName = chat.name || "Chat with no users";
          let chatImage = chat.image || "default-group-image-url";

          if (chat.type === "private" && otherUsers.length === 1) {
            chatName = otherUsers[0].username;
            chatImage = otherUsers[0].profile_img;
          } else if (chat.type === "group") {
            chatName = chat.name || "Group Chat";
          } else if (chat.type === "travel") {
            chatName = chat.name || "Unnamed Travel";
          }

          return (
            <ListGroup.Item
              key={chat.id}
              onClick={() => onChatClick(chat)}
              className={`chat-item bg-light rounded-0 py-3 border-0 my-1 btn fs-4 text-start ${
                selectedChat && selectedChat.id === chat.id ? "selected-chat" : "default-chat"
              }`}
            >
              <div className="d-flex align-items-center bg-trasparent">
                <Image src={chatImage} roundedCircle className="chat-image bg-black me-3" />
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span className="chat-name">{chatName}</span>
                  {unreadCounts[chat.id] > 0 && (
                    <span className="ms-2 rounded-circle notification">{unreadCounts[chat.id]}</span>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          );
        })
      ) : (
        <ListGroup.Item>No chats available</ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default ChatList;
