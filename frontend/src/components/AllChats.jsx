import React, { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat } from "../redux/actions";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const dispatch = useDispatch();

  console.log("Redux state chats:", chats);

  useEffect(() => {
    axios
      .get("/api/chats")
      .then((response) => {
        console.log("Fetched chats:", response.data);
        dispatch(setChats(response.data));
      })
      .catch((error) => {
        console.error("Failed to fetch chats", error);
      });
  }, [dispatch]);

  const handleChatClick = (chat) => {
    console.log("Chat clicked:", chat); // Aggiunto per debug
    dispatch(setSelectedChat(chat));
  };

  return (
    <ListGroup variant="flush">
      {Array.isArray(chats) && chats.length > 0 ? (
        chats.map((chat) => (
          <ListGroup.Item
            key={chat.id}
            onClick={() => handleChatClick(chat)}
            style={{ cursor: "pointer" }} // Assicuriamoci che il cursore cambi
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
