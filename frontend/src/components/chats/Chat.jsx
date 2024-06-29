import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card, Dropdown, Modal, Button, Form, Image, ListGroup } from "react-bootstrap";
import { useChannel, useConnectionStateListener } from "ably/react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
import EditGroupModal from "./EditGroupModal";

const Chat = ({ chat, globalChannel }) => {
  const [messages, setMessages] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const openChats = useSelector((state) => state.chats.openChats);

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

  useEffect(() => {
    axios
      .get(`/api/users/${user.id}/friends`)
      .then((response) => {
        setFriends(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch friends", error);
      });
  }, [user.id]);

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

  const handleViewMembers = () => {
    axios
      .get(`/api/chats/${chat.id}`)
      .then((response) => {
        setMembers(response.data.users);
        setShowMembersModal(true);
      })
      .catch((error) => {
        console.error("Failed to fetch members", error);
      });
  };

  const otherUser = chat.users?.find((u) => u.id !== user.id);

  return (
    <Card className="d-flex flex-column h-100 bg-light border-0" style={{ color: "#000" }}>
      <Card.Header className="bg-dark text-white fs-2 d-flex align-items-center border-bottom rounded-0 justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src={chat.type === "group" ? chat.image : otherUser?.profile_img || "default-profile-image-url"}
            alt="Chat"
            className="rounded-circle me-3"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          {chat.name ||
            (chat.type === "group" ? (
              "Group Chat"
            ) : otherUser ? (
              <Link
                to={`/profile/${otherUser.id}`}
                className="text-white"
                style={{
                  textDecoration: "none",
                }}
              >
                {otherUser.username}
              </Link>
            ) : (
              "Chat with no users"
            ))}
        </div>
        {chat.type === "group" && (
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic" className="border-0">
              &#8942;
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleViewMembers}>Visualizza membri</Dropdown.Item>
              <Dropdown.Item onClick={() => setShowEditModal(true)}>Modifica gruppo</Dropdown.Item>
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

      {/* Modal for Viewing Members */}
      <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Membri del Gruppo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {members.map((member) => (
              <ListGroup.Item key={member.id}>
                <Link
                  to={`/profile/${member.id}`}
                  className="text-black"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Image src={member.profile_img || "default-profile-image-url"} roundedCircle width={30} height={30} />
                  <span className="ms-2">{member.username}</span>
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>

      {/* Modal for Editing Group */}
      <EditGroupModal show={showEditModal} handleClose={() => setShowEditModal(false)} chat={chat} />
    </Card>
  );
};

export default Chat;
