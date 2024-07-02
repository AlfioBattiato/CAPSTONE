import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Container, Button, Offcanvas } from "react-bootstrap";
import AllChats from "../components/chats/AllChats";
import Chat from "../components/chats/Chat";
import { ChannelProvider, useChannel } from "ably/react";
import { setUnreadCount, incrementUnreadCount, decrementUnreadCount, setChats } from "../redux/actions";
import axios from "axios";
import { FaBars } from "react-icons/fa";

const Lobbies = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/api/chats")
      .then((response) => {
        dispatch(setChats(response.data));

        response.data.forEach((chat) => {
          axios
            .get(`/api/chats/${chat.id}/messages`)
            .then((res) => {
              const loadedMessages = res.data;

              const unreadMessages = loadedMessages.filter((message) => {
                const userInMessage = message.users.find((u) => u.id === user.id);
                return userInMessage && !userInMessage.pivot.is_read;
              });

              const unreadCount = unreadMessages.length;

              if (unreadCount > 0) {
                dispatch(setUnreadCount(chat.id, unreadCount));
              }
            })
            .catch((error) => {
              console.error("Error loading messages:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Failed to fetch chats", error);
      });
  }, [dispatch, user.id]);

  const { channel: globalChannel } = useChannel("global", (message) => {
    if (message.name === "message-sent") {
      const { chatId, senderId } = message.data;
      if (senderId !== user.id) {
        dispatch(incrementUnreadCount(chatId));
      }
    } else if (message.name === "message-deleted") {
      const { chatId, wasUnreadByAnyUser } = message.data;
      if (wasUnreadByAnyUser) {
        dispatch(decrementUnreadCount(chatId));
      }
    } else if (message.name === "message-read") {
      const { messageIds, userId } = message.data;
      if (userId !== user.id) {
        messageIds.forEach((messageId) => {
          dispatch(decrementUnreadCount(messageId));
        });
      }
    }
  });

  return (
    <Container className="mt-4 lobbies overflow-hidden" style={{ height: "90vh" }}>
      <Row className="h-100">
        <Col lg={4} xl={3} className="h-100 m-0 p-0 d-none d-lg-block">
          <ChannelProvider channelName="chat-list">
            <AllChats globalChannel={globalChannel} />
          </ChannelProvider>
        </Col>
        <Col
          xs={2}
          md={1}
          className="h-100 m-0 p-0 d-flex align-items-start justify-content-center bg-black d-md-flex d-lg-none"
        >
          <Button variant="outline-light" className="mt-3" onClick={() => setShowOffcanvas(true)}>
            <FaBars size={24} />
          </Button>
        </Col>
        <Col xs={10} md={11} lg={8} xl={9} className="h-100 p-0">
          {selectedChat ? (
            <ChannelProvider channelName={`private-chat.${selectedChat.id}`}>
              <Chat chat={selectedChat} globalChannel={globalChannel} />
            </ChannelProvider>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <h4>Seleziona una chat ed inizia a messaggiare!</h4>
            </div>
          )}
        </Col>
      </Row>

      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>All Chats</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ChannelProvider channelName="chat-list">
            <AllChats globalChannel={globalChannel} />
          </ChannelProvider>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default Lobbies;
