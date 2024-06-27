import React from "react";
import { ListGroup, Badge, Image } from "react-bootstrap";

const ChatList = ({ chats, selectedChat, onChatClick, unreadCounts }) => {
  return (
    <ListGroup className="custom-scrollbar bg-white rounded-0 border-0" style={{ height: "80vh", maxHeight: "80vh" }}>
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
            chatName = `Travel Chat: ${chat.travel ? chat.travel.name : "Unnamed Travel"}`;
          }

          return (
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
              <div className="d-flex align-items-center">
                <Image src={chatImage} roundedCircle style={{ width: "40px", height: "40px", marginRight: "10px" }} />
                <div>
                  {chatName}
                  {unreadCounts[chat.id] > 0 && (
                    <Badge bg="secondary" className="ms-2">
                      {unreadCounts[chat.id]}
                    </Badge>
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
