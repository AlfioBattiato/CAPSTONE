import React, { useEffect, useState } from "react";
import { Card, Button, ButtonGroup, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat, resetUnreadCount, addChat, setChatFilter } from "../../redux/actions";
import ChatList from "./ChatList";
import CreateGroupModal from "./modals/CreateGroupModal";
import { useChannel } from "ably/react";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const unreadCounts = useSelector((state) => state.chats.unreadCounts);
  const chatFilter = useSelector((state) => state.chats.chatFilter);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchChats = () => {
    axios
      .get("/api/chats")
      .then((response) => {
        dispatch(setChats(response.data));
      })
      .catch((error) => {
        console.error("Failed to fetch chats", error);
      });
  };

  const { channel: chatListChannel } = useChannel("chat-list", (message) => {
    console.log("Received message on chat-list channel:", message);

    if (message.name === "chat.created") {
      const newChat = message.data.chat;
      console.log("New chat received:", newChat);
      dispatch(addChat(newChat));
      fetchChats();
    }
  });

  useEffect(() => {
    fetchChats();
  }, [dispatch]);

  const handleChatClick = (chat) => {
    dispatch(setSelectedChat(chat));
    dispatch(resetUnreadCount(chat.id));
  };

  const filteredChats = chats.filter((chat) => {
    if (chatFilter !== "all" && chat.type !== chatFilter) {
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

  const handleFilterChange = (filter) => {
    dispatch(setChatFilter(filter));
  };

  return (
    <Card className="h-100 neumorphic-card border-0 d-flex flex-column">
      <Card.Header className="fs-2 d-flex flex-column align-items-center justify-content-between rounded-0 neumorphic-header">
        <div className="d-flex w-100 justify-content-between">
          <ButtonGroup className="w-100">
            <Button variant="light" onClick={() => handleFilterChange("private")} active={chatFilter === "private"}>
              Utenti
            </Button>
            <Button variant="light" onClick={() => handleFilterChange("group")} active={chatFilter === "group"}>
              Gruppi
            </Button>
            <Button variant="light" onClick={() => handleFilterChange("travel")} active={chatFilter === "travel"}>
              Viaggi
            </Button>
            <Button variant="light" onClick={() => handleFilterChange("all")} active={chatFilter === "all"}>
              Tutti
            </Button>
          </ButtonGroup>
        </div>
        <Form.Control
          type="text"
          placeholder="Cerca chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2 rounded-pill search-input"
        />
      </Card.Header>
      <Card.Body className="p-0 d-flex flex-column flex-grow-1 overflow-hidden bg-light">
        {(chatFilter === "all" || chatFilter === "group") && (
          <div className="d-flex justify-content-end mt-2 me-3 bg-transparent">
            <Button className="rounded-pill gradient-orange border-0 mb-1" onClick={() => setShowModal(true)}>
              Nuovo Gruppo
            </Button>
          </div>
        )}
        <ChatList
          chats={filteredChats}
          onChatClick={handleChatClick}
          selectedChat={selectedChat}
          unreadCounts={unreadCounts}
          chatListChannel={chatListChannel}
        />
      </Card.Body>

      <CreateGroupModal show={showModal} handleClose={() => setShowModal(false)} />
    </Card>
  );
};

export default AllChats;
