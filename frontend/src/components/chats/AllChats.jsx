import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat, resetUnreadCount } from "../../redux/actions";
import ChatList from "./ChatList";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const unreadCounts = useSelector((state) => state.chats.unreadCounts);
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
    dispatch(resetUnreadCount(chat.id));
  };

  return (
    <Card className="h-100">
      <Card.Header className="fs-2 d-flex align-items-center rounded-0 bg-blue text-white">
        <span>Chats</span>
      </Card.Header>
      <Card.Body className="p-0">
        <ChatList chats={chats} onChatClick={handleChatClick} selectedChat={selectedChat} unreadCounts={unreadCounts} />
      </Card.Body>
    </Card>
  );
};

export default AllChats;
