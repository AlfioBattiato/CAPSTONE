import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setChats, setSelectedChat, resetUnreadCount } from "../../redux/actions";
import GroupList from "./GroupList";
import ChatList from "./ChatList";
import GroupMembers from "./GroupMembers";

const AllChats = () => {
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const unreadCounts = useSelector((state) => state.chats.unreadCounts);
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
    dispatch(resetUnreadCount(chat.id));
  };

  const handlePrivateChatsClick = () => {
    setSelectedGroup(null);
    setIsPrivateChatsSelected(true);
  };

  const groupChats = chats.filter((chat) => chat.pivot.type === "group");
  const privateChats = chats.filter((chat) => chat.pivot.type === "private");

  return (
    <Card className="h-100">
      <Card.Header
        className={`fs-2 d-flex align-items-center rounded-0 ${
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
              <ChatList
                chats={privateChats}
                onChatClick={handleChatClick}
                selectedChat={selectedChat}
                unreadCounts={unreadCounts}
              />
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
