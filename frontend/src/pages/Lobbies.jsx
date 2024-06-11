import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import AllChats from "../components/AllChats";
import Chat from "../components/Chat";

const Lobbies = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  return (
    <Container fluid>
      <Row>
        <Col xs={3} className="p-0">
          <AllChats />
        </Col>
        <Col xs={9} className="p-0">
          {selectedChat ? (
            <Chat chat={selectedChat} />
          ) : (
            <div className="d-flex align-items-center justify-content-center">
              Please select a chat to start messaging
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Lobbies;
