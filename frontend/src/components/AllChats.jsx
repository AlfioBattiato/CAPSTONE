import React, { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat } from "../redux/actions";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/api/chats")
      .then((response) => {
        dispatch(setChats(response.data));
      })
      .catch((error) => {
        console.error("Failed to fetch chats", error);
      });
  }, [dispatch]);

  const handleChatClick = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  return (
    <ListGroup className="custom-scrollbar bg-white" style={{ height: "80vh", maxHeight: "80vh" }}>
      {Array.isArray(chats) && chats.length > 0 ? (
        chats.map((chat) => (
          <ListGroup.Item
            key={chat.id}
            onClick={() => handleChatClick(chat)}
            className={`chat-item ${
              selectedChat && selectedChat.id === chat.id ? "bg-danger text-white" : "bg-blue text-white"
            }`}
            style={{
              cursor: "pointer",
              border: "none",
              padding: "10px 15px",
            }}
            onMouseEnter={(e) => {
              if (!(selectedChat && selectedChat.id === chat.id)) {
                e.currentTarget.classList.add("bg-white");
                e.currentTarget.classList.add("text-black");
                e.currentTarget.classList.remove("bg-danger");
                e.currentTarget.classList.remove("bg-blue");
                e.currentTarget.classList.remove("text-white");
              }
            }}
            onMouseLeave={(e) => {
              if (!(selectedChat && selectedChat.id === chat.id)) {
                e.currentTarget.classList.remove("bg-white");
                e.currentTarget.classList.remove("text-black");
                if (selectedChat && selectedChat.id === chat.id) {
                  e.currentTarget.classList.add("bg-danger");
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
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No chats available</ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default AllChats;
