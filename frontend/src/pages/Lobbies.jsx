import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import AllChats from "../components/chats/AllChats";
import Chat from "../components/chats/Chat";
import { ChannelProvider, useChannel } from "ably/react";
import { setUnreadCount, incrementUnreadCount, decrementUnreadCount, setChats } from "../redux/actions";
import axios from "axios";

const Lobbies = () => {
  const selectedChat = useSelector((state) => state.chats.selectedChat);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/api/chats")
      .then((response) => {
        console.log("Fetched chats:", response.data);
        dispatch(setChats(response.data));

        response.data.forEach((chat) => {
          axios
            .get(`/api/chats/${chat.id}/messages`)
            .then((res) => {
              const loadedMessages = res.data;
              console.log(`Messages for chat ${chat.id}:`, loadedMessages);

              const unreadMessages = loadedMessages.filter((message) => {
                const userInMessage = message.users.find((u) => u.id === user.id);
                return userInMessage && !userInMessage.pivot.is_read;
              });

              const unreadCount = unreadMessages.length;
              console.log(`Unread count for chat ${chat.id}:`, unreadCount);

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
      console.log(`Incrementing unread count for chat ${chatId}`);
      if (senderId !== user.id) {
        dispatch(incrementUnreadCount(chatId));
      }
    } else if (message.name === "message-deleted") {
      const { chatId, wasUnreadByAnyUser } = message.data;
      console.log(`Decrementing unread count for chat ${chatId}`);
      if (wasUnreadByAnyUser) {
        dispatch(decrementUnreadCount(chatId));
      }
    } else if (message.name === "message-read") {
      const { messageIds, userId } = message.data;
      console.log(`Marking messages as read for chat ${messageIds}`);
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
        <Col md={3} className="h-100 p-0">
          <AllChats />
        </Col>
        <Col md={9} className="h-100 p-0">
          {selectedChat ? (
            <ChannelProvider channelName={`private-chat.${selectedChat.id}`}>
              <Chat chat={selectedChat} globalChannel={globalChannel} />
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
