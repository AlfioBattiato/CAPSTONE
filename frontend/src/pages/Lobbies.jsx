import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import AllChats from "../components/AllChats";
import Chat from "../components/Chat";

const Lobbies = () => {
  const selectedChat = useSelector((state) => state.chats.selectedChat);

  return (
    <div className="container mt-5">
      <Row className="">
        <Col md={4} className="">
          <AllChats />
        </Col>
        <Col md={8} className="">
          {selectedChat ? (
            <Chat chat={selectedChat} />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <h4>Select a chat to start messaging</h4>
            </div>
          )}
        </Col>
      </Row>

    </div>
  );
};

export default Lobbies;
