import React, { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat } from "../redux/actions";

const AllChats = () => {
  const chats = useSelector((state) => state.chat.user);
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
    <ListGroup variant="flush">
      {Array.isArray(chats) && chats.length > 0 ? (
        chats.map((chat) => (
          <ListGroup.Item key={chat.id} onClick={() => handleChatClick(chat)}>
            {chat.name || `Chat with ${chat.users.map((user) => user.username).join(", ")}`}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No chats available</ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default AllChats;
