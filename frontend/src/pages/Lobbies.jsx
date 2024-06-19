import React from "react";
import { useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import AllChats from "../components/chats/AllChats";
import Chat from "../components/chats/Chat";
import { ChannelProvider } from "ably/react";

const Lobbies = () => {
  const selectedChat = useSelector((state) => state.chats.selectedChat);

  return (
    <Container style={{ height: "90vh" }}>
      <Row className="h-100">
        <Col md={3} className="h-100 p-0">
          <AllChats />
        </Col>
        <Col md={9} className="h-100 p-0">
          {selectedChat ? (
            <ChannelProvider channelName={`private-chat.${selectedChat.id}`}>
              <Chat chat={selectedChat} />
            </ChannelProvider>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <h4>Select a chat to start messaging</h4>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Lobbies;
