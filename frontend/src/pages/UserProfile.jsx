import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setSelectedChat, setChats, setActionTravels } from "../redux/actions";
import DashboardModal from "../components/userProfile/DashboardModal";
import FriendsModal from "../components/userProfile/FriendsModal";
import RequestsModal from "../components/userProfile/RequestsModal";
import TravelCard from "../components/card/TravelCard";
import { useChannel } from "ably/react";

const UserProfile = () => {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const travels = useSelector((state) => state.infotravels.alltravels);
  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { channel: chatListChannel } = useChannel("chat-list");

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((response) => {
        setProfileUser(response.data);
        setLoadingProfile(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoadingProfile(false);
      });

    axios
      .get(`/api/users/${id}/travels`)
      .then((response) => {
        dispatch(setActionTravels(response.data));
      })
      .catch((error) => {
        console.error("Error fetching travels:", error);
      });
  }, [id, dispatch]);

  const handleProfileImageUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
  };

  const createOrOpenChat = async () => {
    try {
      const response = await axios.get("/api/chats");
      const existingChat = response.data.find(
        (chat) =>
          chat.type === "private" &&
          chat.users &&
          chat.users.some((user) => user.id === profileUser.id) &&
          chat.users.some((user) => user.id === loggedInUser.id)
      );

      if (existingChat) {
        dispatch(setSelectedChat(existingChat));
        navigate("/lobbies");
      } else {
        const newChatResponse = await axios.post("/api/chats/private", {
          user_id: profileUser.id,
        });
        const newChat = newChatResponse.data;

        const updatedChatsResponse = await axios.get("/api/chats");
        dispatch(setChats(updatedChatsResponse.data));

        const updatedChat = updatedChatsResponse.data.find((chat) => chat.id === newChat.id);

        // Pubblica l'evento chat.created su chatListChannel
        chatListChannel.publish("chat.created", { chat: newChat });

        dispatch(setSelectedChat(updatedChat));
        navigate("/lobbies");
      }
    } catch (error) {
      console.error("Error creating or opening chat:", error);
    }
  };

  const sendFriendRequest = async () => {
    try {
      await axios.post("/api/friendships/send", { addressee_id: profileUser.id });
      alert("Richiesta di amicizia inviata!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleShowFriendsModal = () => {
    setShowFriendsModal(true);
  };

  const handleCloseFriendsModal = () => {
    setShowFriendsModal(false);
  };

  const handleShowRequestsModal = () => {
    setShowRequestsModal(true);
  };

  const handleCloseRequestsModal = () => {
    setShowRequestsModal(false);
  };

  if (loadingProfile || !profileUser) {
    return <Spinner animation="border" />;
  }

  const isOwner = loggedInUser && profileUser.id === loggedInUser.id;
  const currentDate = new Date().toISOString().split("T")[0];
  const activeTravels = travels.filter((travel) => travel.active && travel.expiration_date >= currentDate);

  return (
    <Container className="pt-5 bg-light" style={{ height: "100vh" }}>
      <Row className="align-items-center">
        <Col md={3} className="text-center">
          <div
            className="border rounded-circle overflow-hidden"
            style={{ width: "200px", height: "200px", margin: "0 auto" }}
          >
            <img
              src={profileUser.profile_img}
              alt="profile_img"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
        </Col>
        <Col md={9}>
          <Row className="d-flex align-items-center me-5">
            <Col xs={9}>
              <h3>{profileUser.username}</h3>
            </Col>
            <Col xs={3}>
              <Row className="gy-2 text-center">
                {isOwner && (
                  <Col xs={12}>
                    <Button onClick={() => setShowModal(true)} className="gradient-orange border-0 rounded-pill">
                      Edit Profile
                    </Button>
                  </Col>
                )}
                {!isOwner && (
                  <Col xs={12}>
                    <Button onClick={createOrOpenChat} className="gradient-orange border-0 rounded-pill">
                      Inizia Chat
                    </Button>
                  </Col>
                )}
                <Col xs={12}>
                  <Button onClick={handleShowFriendsModal} className="gradient-orange border-0 rounded-pill">
                    Mostra Amici
                  </Button>
                </Col>
                {!isOwner && (
                  <Col xs={12}>
                    <Button onClick={sendFriendRequest} className="gradient-orange border-0 rounded-pill">
                      Aggiungi Amico
                    </Button>
                  </Col>
                )}
                {isOwner && (
                  <Col xs={12}>
                    <Button onClick={handleShowRequestsModal} className="gradient-orange border-0 rounded-pill">
                      Visualizza Richieste
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3>I miei viaggi in programma</h3>
          {activeTravels.length > 0 ? (
            <Row>
              {activeTravels.map((travel) => (
                <Col md={4} key={travel.id} className="mb-4">
                  <TravelCard travel={travel} showParticipants={false} />
                </Col>
              ))}
            </Row>
          ) : (
            <p>Nessun viaggio trovato.</p>
          )}
        </Col>
      </Row>

      <DashboardModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onProfileImageUpdate={handleProfileImageUpdate}
      />

      <FriendsModal show={showFriendsModal} onClose={handleCloseFriendsModal} userId={id} />

      <RequestsModal show={showRequestsModal} onClose={handleCloseRequestsModal} />
    </Container>
  );
};

export default UserProfile;
