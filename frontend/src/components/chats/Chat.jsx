import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Dropdown } from "react-bootstrap";
import { useChannel, useConnectionStateListener } from "ably/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  openChat,
  closeChat,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  setChats,
} from "../../redux/actions";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import EditGroupModal from "./modals/EditGroupModal";
import ViewMembersModal from "./modals/ViewMembersModal";
import { BsThreeDotsVertical } from "react-icons/bs";

const Chat = ({ chat, globalChannel }) => {
  const [messages, setMessages] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [groupImage, setGroupImage] = useState(chat.image); // Stato per l'immagine del gruppo
  const [groupName, setGroupName] = useState(chat.name); // Stato per il nome del gruppo o del viaggio
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const openChats = useSelector((state) => state.chats.openChats);
  const navigate = useNavigate();

  const { channel: privateChannel } = useChannel(`private-chat.${chat.id}`, (message) => {
    const receivedMessage = message.data;

    if (message.name === "message-sent") {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);

      if (receivedMessage.sender_id !== user.id && !openChats.includes(chat.id)) {
        dispatch(incrementUnreadCount(chat.id));
      }

      if (receivedMessage.sender_id !== user.id && openChats.includes(chat.id)) {
        axios
          .post("/api/messages/mark-as-read", { messageIds: [receivedMessage.id] })
          .then(() => {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => (msg.id === receivedMessage.id ? { ...msg, is_read: true } : msg))
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

      if (deletedMessage && deletedMessage.sender_id !== user.id && !deletedMessage.is_read) {
        dispatch(decrementUnreadCount(chat.id));
      }
    } else if (message.name === "message-read") {
      const { messageIds, userId } = receivedMessage;
      if (userId !== user.id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg))
        );
      }
    }
  });

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  // Sincronizza lo stato locale con le props
  useEffect(() => {
    setGroupImage(chat.image);
    setGroupName(chat.name);
  }, [chat]);

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
          .filter((message) => {
            const userPivot = message.users.find((u) => u.id === user.id)?.pivot;
            return userPivot && !userPivot.is_read && !userPivot.sender;
          })
          .map((message) => message.id);

        if (unreadMessageIds.length > 0) {
          axios
            .post(`/api/messages/mark-as-read`, { messageIds: unreadMessageIds })
            .then(() => {
              setMessages((prevMessages) =>
                prevMessages.map((message) =>
                  unreadMessageIds.includes(message.id) ? { ...message, is_read: true } : message
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
  }, [chat, dispatch, user.id]);

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

      const messageData = response.data;
      messageData.users = [{ id: user.id, username: user.username, pivot: { sender: true } }];

      privateChannel.publish("message-sent", messageData);
      globalChannel.publish("message-sent", { chatId: chat.id, senderId: user.id });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const message = messages.find((msg) => msg.id === messageId);
      const wasUnreadByAnyUser = !message.users.some((u) => u.pivot.is_read);

      await axios.delete(`/api/messages/${messageId}`);
      privateChannel.publish("message-deleted", {
        chatId: chat.id,
        messageId,
        wasUnreadByAnyUser,
      });
      globalChannel.publish("message-deleted", {
        chatId: chat.id,
        messageId,
        wasUnreadByAnyUser,
      });
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  const handleMarkAsRead = (messageId) => {
    axios
      .post("/api/messages/mark-as-read", { messageIds: [messageId] })
      .then(() => {
        privateChannel.publish("message-read", { messageIds: [messageId], userId: user.id });
        setMessages((prevMessages) =>
          prevMessages.map((message) => (message.id === messageId ? { ...message, is_read: true } : message))
        );
      })
      .catch((error) => {
        console.error("Error marking message as read:", error);
      });
  };

  const handleImageUpdate = (newImage) => {
    setGroupImage(newImage);
  };

  const handleNameUpdate = (newName) => {
    setGroupName(newName);
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.post(`/api/chats/${chat.id}/leave`);
      window.location.reload(); // Refresh the page to navigate to the lobbies
    } catch (error) {
      console.error("Error leaving the group", error);
    }
  };

  const otherUser = chat.users?.find((u) => u.id !== user.id);

  return (
    <Card className="d-flex flex-column h-100 bg-light border-0" style={{ color: "#000" }}>
      <Card.Header
        className="bg-black text-white fs-2 d-flex py-4 align-items-center border-bottom rounded-0 justify-content-between"
        style={{ maxHeight: "80px" }}
      >
        <div className="d-flex align-items-center">
          <img
            src={
              chat.type === "group"
                ? groupImage
                : chat.type === "travel"
                ? groupImage
                : otherUser?.profile_img || "default-profile-image-url"
            }
            alt="Chat"
            className="rounded-circle bg-white me-3"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
          {chat.type === "group" ? (
            groupName
          ) : chat.type === "travel" ? (
            <Link
              to={`/infoTravel/${chat.travel_id}`}
              className="text-white"
              style={{
                textDecoration: "none",
                marginLeft: "10px", // Add some margin to separate it from the image
              }}
            >
              {groupName}
            </Link>
          ) : otherUser ? (
            <Link
              to={`/profile/${otherUser.id}`}
              className="text-white"
              style={{
                textDecoration: "none",
                marginLeft: "10px", // Add some margin to separate it from the image
              }}
            >
              {otherUser.username}
            </Link>
          ) : (
            "Chat with no users"
          )}
        </div>
        {(chat.type === "group" || chat.type === "travel") && (
          <Dropdown>
            <Dropdown.Toggle
              as="span"
              variant="dark"
              id="dropdown-basic"
              className="border-0 fs-1 dropdown-toggle-icon"
            >
              <BsThreeDotsVertical className="pb-2 pointer" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="search-results">
              <Dropdown.Item onClick={() => setShowMembersModal(true)}>Visualizza membri</Dropdown.Item>
              <Dropdown.Item onClick={() => setShowEditModal(true)}>Modifica gruppo</Dropdown.Item>
              <Dropdown.Item onClick={handleLeaveGroup}>Esci dal gruppo</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Card.Header>
      <div className="flex-grow-1 overflow-auto custom-scrollbar">
        <MessageList
          messages={messages}
          onDelete={handleDeleteMessage}
          onMarkAsRead={handleMarkAsRead}
          messagesEndRef={messagesEndRef}
        />
      </div>
      <Card.Footer className="bg-light text-white mt-2">
        <MessageForm chatId={chat.id} onSendMessage={handleSendMessage} />
      </Card.Footer>

      <ViewMembersModal show={showMembersModal} handleClose={() => setShowMembersModal(false)} chatId={chat.id} />

      <EditGroupModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        chat={chat}
        onImageUpdate={handleImageUpdate}
        onNameUpdate={handleNameUpdate}
      />
    </Card>
  );
};

export default Chat;
