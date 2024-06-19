import React, { useEffect, useState } from "react";
import { ListGroup, Row, Col, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat } from "../../redux/actions";
import GroupList from "./GroupList";
import ChatList from "./ChatList";
import GroupMembers from "./GroupMembers";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isPrivateChatsSelected, setIsPrivateChatsSelected] = useState(true);
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

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    dispatch(setSelectedChat(group));
    setIsPrivateChatsSelected(false);
  };

  const handleChatClick = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  const handlePrivateChatsClick = () => {
    setSelectedGroup(null);
    setIsPrivateChatsSelected(true);
  };

  const groupChats = chats.filter((chat) => chat.group_chat);
  const privateChats = chats.filter((chat) => !chat.group_chat);

  return (
    <Card style={{ height: "90vh", maxHeight: "90vh" }}>
      <Card.Header
        className={`fs-2 d-flex align-items-center border-bottom rounded-0 ${
          isPrivateChatsSelected ? "bg-red" : "bg-blue text-white"
        }`}
        onClick={handlePrivateChatsClick}
        style={{ cursor: "pointer" }}
      >
        <span>Private Chats</span>
      </Card.Header>
      <Card.Body className="p-0">
        <Row className="h-100 m-0">
          <Col md={3} className="p-0 h-100">
            <GroupList groups={groupChats} selectedGroup={selectedGroup} onGroupClick={handleGroupClick} />
          </Col>
          <Col md={9} className="p-0 h-100">
            {isPrivateChatsSelected ? (
              <ChatList chats={privateChats} onChatClick={handleChatClick} selectedChat={selectedChat} />
            ) : (
              <GroupMembers group={selectedGroup} />
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AllChats;
