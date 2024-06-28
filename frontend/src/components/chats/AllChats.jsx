import React, { useEffect, useState } from "react";
import { Card, Button, ButtonGroup, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat, resetUnreadCount } from "../../redux/actions";
import ChatList from "./ChatList";
import CreateGroupModal from "./CreateGroupModal";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const unreadCounts = useSelector((state) => state.chats.unreadCounts);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    <Card className="h-100 neumorphic-card border-0 d-flex flex-column">
      <Card.Header className="fs-2 d-flex flex-column align-items-center justify-content-between rounded-0 neumorphic-header">
        <div className="d-flex w-100 justify-content-between">
          <ButtonGroup className="w-100">
            <Button variant="light" onClick={() => setFilter("private")} active={filter === "private"}>
              Utenti
            </Button>
            <Button variant="light" onClick={() => setFilter("group")} active={filter === "group"}>
              Gruppi
            </Button>
            <Button variant="light" onClick={() => setFilter("travel")} active={filter === "travel"}>
              Viaggi
            </Button>
            <Button variant="light" onClick={() => setFilter("all")} active={filter === "all"}>
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
        <div className="d-flex justify-content-end m-2 bg-trasparent">
          <Button className="rounded-pill gradient-orange border-0" onClick={() => setShowModal(true)}>
            Nuovo Gruppo
          </Button>
        </div>
        <ChatList
          chats={filteredChats}
          onChatClick={handleChatClick}
          selectedChat={selectedChat}
          unreadCounts={unreadCounts}
        />
      </Card.Body>

      <CreateGroupModal show={showModal} handleClose={() => setShowModal(false)} />
    </Card>
  );
};

export default AllChats;
