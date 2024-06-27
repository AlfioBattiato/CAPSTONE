import React, { useEffect, useState } from "react";
import { Card, Button, ButtonGroup, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat, resetUnreadCount } from "../../redux/actions";
import ChatList from "./ChatList";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const unreadCounts = useSelector((state) => state.chats.unreadCounts);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredChats = chats.filter((chat) => {
    if (filter !== "all" && chat.type !== filter) {
      return false;
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      if (
        (chat.name && chat.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (chat.type === "private" &&
          chat.users.some((user) => user.username.toLowerCase().includes(lowerCaseSearchTerm)))
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <Card className="h-100">
      <Card.Header className="fs-2 d-flex flex-column align-items-center justify-content-between rounded-0 bg-light text-white">
        <div className="d-flex w-100 justify-content-between">
          <ButtonGroup className="w-100">
            <Button variant="light" onClick={() => setFilter("all")} active={filter === "all"}>
              All
            </Button>
            <Button variant="light" onClick={() => setFilter("private")} active={filter === "private"}>
              Private
            </Button>
            <Button variant="light" onClick={() => setFilter("group")} active={filter === "group"}>
              Group
            </Button>
            <Button variant="light" onClick={() => setFilter("travel")} active={filter === "travel"}>
              Travel
            </Button>
          </ButtonGroup>
        </div>
        <Form.Control
          type="text"
          placeholder="Cerca chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 rounded-pill"
        />
      </Card.Header>
      <Card.Body className="p-0">
        <ChatList
          chats={filteredChats}
          onChatClick={handleChatClick}
          selectedChat={selectedChat}
          unreadCounts={unreadCounts}
        />
      </Card.Body>
    </Card>
  );
};

export default AllChats;
