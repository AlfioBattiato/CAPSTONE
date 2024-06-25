import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { useChannel, useConnectionStateListener } from "ably/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { openChat, closeChat, incrementUnreadCount, decrementUnreadCount, resetUnreadCount } from "../../redux/actions";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";

const Chat = ({ chat, globalChannel }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const openChats = useSelector((state) => state.chats.openChats);

  // Create a channel using Ably
  const { channel: privateChannel } = useChannel(`private-chat.${chat.id}`, (message) => {
    const receivedMessage = message.data;

    if (message.name === "message-sent") {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);

      // Increment unread count if the chat is not open and the message is from another user
      if (receivedMessage.user_id !== user.id && !openChats.includes(chat.id)) {
        dispatch(incrementUnreadCount(chat.id));
      }

      // Mark message as read if the chat is open and the message is from another user
      if (receivedMessage.user_id !== user.id && openChats.includes(chat.id)) {
        axios
          .post("/api/messages/mark-as-read", { messageIds: [receivedMessage.id] })
          .then(() => {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => (msg.id === receivedMessage.id ? { ...msg, is_unread: false } : msg))
            );
            dispatch(resetUnreadCount(chat.id));
          })
          .catch((error) => {
            console.error("Error marking message as read:", error);
          });
      }
    } else if (message.name === "message-deleted") {
      const deletedMessage = messages.find((msg) => msg.id === receivedMessage.messageId);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== receivedMessage.messageId));

      // Decrement unread count if the deleted message was unread and from another user
      if (deletedMessage && deletedMessage.user_id !== user.id && deletedMessage.is_unread) {
        dispatch(decrementUnreadCount(chat.id));
      }
    } else if (message.name === "message-read") {
      const { messageIds } = receivedMessage;
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (messageIds.includes(msg.id) ? { ...msg, is_unread: false } : msg))
      );
    }
  });

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  useEffect(() => {
    dispatch(openChat(chat.id));

    return () => {
      dispatch(closeChat(chat.id));
    };
  }, [chat.id, dispatch]);

  useEffect(() => {
    axios
      .get(`/api/chats/${chat.id}/messages`)
      .then((response) => {
        const loadedMessages = response.data;
        setMessages(loadedMessages);

        const unreadMessageIds = loadedMessages
          .filter((message) => message.is_unread && message.user_id !== chat.pivot.user_id)
          .map((message) => message.id);

        if (unreadMessageIds.length > 0) {
          axios
            .post(`/api/messages/mark-as-read`, { messageIds: unreadMessageIds })
            .then(() => {
              setMessages((prevMessages) =>
                prevMessages.map((message) =>
                  unreadMessageIds.includes(message.id) ? { ...message, is_unread: false } : message
                )
              );
              dispatch(resetUnreadCount(chat.id));
            })
            .catch((error) => {
              console.error("Error marking messages as read:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });
  }, [chat, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (formData) => {
    try {
      const response = await axios.post("/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      privateChannel.publish("message-sent", response.data);
      globalChannel.publish("message-sent", { chatId: chat.id, userId: user.id });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const message = messages.find((msg) => msg.id === messageId);
      await axios.delete(`/api/messages/${messageId}`);
      privateChannel.publish("message-deleted", {
        chatId: chat.id,
        messageId,
        userId: message.user_id,
        wasUnread: message.is_unread,
      });
      globalChannel.publish("message-deleted", {
        chatId: chat.id,
        messageId,
        userId: message.user_id,
        wasUnread: message.is_unread,
      });
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleMarkAsRead = (messageId) => {
    axios
      .post("/api/messages/mark-as-read", { messageIds: [messageId] })
      .then(() => {
        privateChannel.publish("message-read", { messageIds: [messageId] });
        setMessages((prevMessages) =>
          prevMessages.map((message) => (message.id === messageId ? { ...message, is_unread: false } : message))
        );
      })
      .catch((error) => {
        console.error("Error marking message as read:", error);
      });
  };

  const otherUser = chat.users?.find((user) => user.id !== chat.pivot.user_id);

  return (
    <Card className="d-flex flex-column h-100 bg-light" style={{ color: "#000" }}>
      <Card.Header className="bg-blue text-white fs-2 d-flex align-items-center border-bottom rounded-0">
        <img
          src={chat.group_chat ? chat.image : otherUser?.profile_img || "default-profile-image-url"}
          alt="Chat"
          className="rounded-circle me-3"
          style={{ width: "40px", height: "40px" }}
        />
        {chat.name ||
          (chat.group_chat
            ? "Group Chat"
            : chat.users && chat.users.length === 1
            ? chat.users[0].username
            : chat.users
            ? chat.users
                .filter((user) => user.id !== chat.pivot.user_id)
                .map((user) => (
                  <Link key={user.id} to={`/profile/${user.id}`} className="text-white">
                    {user.username}
                  </Link>
                ))
                .reduce((prev, curr) => [prev, ", ", curr])
            : "Chat with no users")}
      </Card.Header>
      <MessageList
        messages={messages}
        onDelete={handleDeleteMessage}
        onMarkAsRead={handleMarkAsRead}
        messagesEndRef={messagesEndRef}
      />
      <Card.Footer className="bg-blue text-white">
        <MessageForm chatId={chat.id} onSendMessage={handleSendMessage} />
      </Card.Footer>
    </Card>
  );
};

export default Chat;
