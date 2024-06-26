import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Button, Card, Modal, ListGroup, Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "../components/userProfile/Dashboard";
import { setSelectedChat, setChats } from "../redux/actions";

const UserProfile = () => {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [profileUser, setProfileUser] = useState(null);
  const [travels, setTravels] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingTravels, setLoadingTravels] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((response) => {
        setProfileUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    axios
      .get(`/api/users/${id}/travels`)
      .then((response) => {
        setTravels(response.data);
        setLoadingTravels(false);
      })
      .catch((error) => {
        console.error("Error fetching travels:", error);
        setLoadingTravels(false);
      });

    axios
      .get(`/api/users/${id}/friends`)
      .then((response) => {
        setFriends(response.data);
        setLoadingFriends(false);
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
        setLoadingFriends(false);
      });

    if (loggedInUser.id === parseInt(id)) {
      axios
        .get(`/api/friendships/requests`)
        .then((response) => {
          setPendingRequests(response.data);
          setLoadingRequests(false);
        })
        .catch((error) => {
          console.error("Error fetching friend requests:", error);
          setLoadingRequests(false);
        });
    }
  }, [id, loggedInUser.id]);

  const handleProfileImageUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
  };

  const createOrOpenChat = async () => {
    try {
      const response = await axios.get("/api/chats");
      const existingChat = response.data.find(
        (chat) =>
          chat.users.some((user) => user.id === profileUser.id) &&
          chat.users.some((user) => user.id === loggedInUser.id) &&
          chat.users.some((user) => user.pivot && user.pivot.type === "private")
      );

      if (existingChat) {
        dispatch(setSelectedChat(existingChat));
        navigate("/lobbies");
      } else {
        const newChatResponse = await axios.post("/api/chats", {
          name: null,
          active: true,
          travel_id: null,
          image: null,
        });
        const newChat = newChatResponse.data;
        await axios.post(`/api/chats/${newChat.id}/add-user`, { user_id: profileUser.id, type: "private" });
        await axios.post(`/api/chats/${newChat.id}/add-user`, { user_id: loggedInUser.id, type: "private" });

        const updatedChatsResponse = await axios.get("/api/chats");
        dispatch(setChats(updatedChatsResponse.data));

        const updatedChat = updatedChatsResponse.data.find((chat) => chat.id === newChat.id);

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

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(`/api/friendships/${requestId}/accept`);
      setPendingRequests(pendingRequests.filter((request) => request.id !== requestId));
      alert("Richiesta di amicizia accettata!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await axios.post(`/api/friendships/${requestId}/decline`);
      setPendingRequests(pendingRequests.filter((request) => request.id !== requestId));
      alert("Richiesta di amicizia rifiutata!");
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  if (!profileUser) {
    return <div>Loading...</div>;
  }

  const isOwner = loggedInUser && profileUser.id === loggedInUser.id;
  const currentDate = new Date().toISOString().split("T")[0];

  const activeTravels = travels.filter((travel) => travel.active && travel.expiration_date >= currentDate);
  const inactiveTravels = travels.filter((travel) => !travel.active || travel.expiration_date < currentDate);

  return (
    <Container className="mt-5">
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
          <h3>{profileUser.username}</h3>
          {isOwner && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Edit Profile
            </Button>
          )}
          {!isOwner && (
            <>
              <Button variant="success" onClick={createOrOpenChat}>
                Inizia Chat
              </Button>
              <Button variant="info" onClick={sendFriendRequest} className="ms-2">
                Aggiungi Amico
              </Button>
            </>
          )}
          <Button variant="info" onClick={handleShowFriendsModal} className="ms-2">
            Mostra Amici
          </Button>
          {isOwner && (
            <Button variant="warning" onClick={handleShowRequestsModal} className="ms-2">
              Visualizza Richieste
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3>I miei viaggi in programma</h3>
          {loadingTravels ? (
            <Spinner animation="border" />
          ) : activeTravels.length > 0 ? (
            <Row>
              {activeTravels.map((travel, index) => (
                <Col md={4} key={`active-travel-${travel.id}-${index}`} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src="path/to/default-image.jpg" alt={travel.start_location} />
                    <Card.Body>
                      <Card.Title>{travel.start_location}</Card.Title>
                      <Card.Text>Tipo di moto: {travel.type_moto}</Card.Text>
                      <Card.Text>Data di partenza: {travel.departure_date}</Card.Text>
                      <Card.Text>Data di scadenza: {travel.expiration_date}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>Nessun viaggio trovato.</p>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h3>I miei viaggi passati</h3>
          {loadingTravels ? (
            <Spinner animation="border" />
          ) : inactiveTravels.length > 0 ? (
            <Row>
              {inactiveTravels.map((travel, index) => (
                <Col md={4} key={`inactive-travel-${travel.id}-${index}`} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src="path/to/default-image.jpg" alt={travel.start_location} />
                    <Card.Body>
                      <Card.Title>{travel.start_location}</Card.Title>
                      <Card.Text>Tipo di moto: {travel.type_moto}</Card.Text>
                      <Card.Text>Data di partenza: {travel.departure_date}</Card.Text>
                      <Card.Text>Data di scadenza: {travel.expiration_date}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>Nessun viaggio trovato.</p>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Dashboard onProfileImageUpdate={handleProfileImageUpdate} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFriendsModal} onHide={handleCloseFriendsModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>I miei amici</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingFriends ? (
            <Spinner animation="border" />
          ) : friends.length > 0 ? (
            <ListGroup>
              {friends.map((friend) => (
                <ListGroup.Item key={friend.id} action onClick={() => navigate(`/profile/${friend.id}`)}>
                  <Image
                    src={friend.profile_img || "path/to/default-profile-image.jpg"}
                    roundedCircle
                    style={{ width: "40px", height: "40px", marginRight: "10px" }}
                  />
                  <span>{friend.username}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Nessun amico trovato.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFriendsModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRequestsModal} onHide={handleCloseRequestsModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Richieste di amicizia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingRequests ? (
            <Spinner animation="border" />
          ) : pendingRequests.length > 0 ? (
            <ListGroup>
              {pendingRequests.map((request) => (
                <ListGroup.Item key={request.id}>
                  <Image
                    src={request.requester.profile_img || "path/to/default-profile-image.jpg"}
                    roundedCircle
                    style={{ width: "40px", height: "40px", marginRight: "10px" }}
                  />
                  <span>{request.requester.username}</span>
                  <Button variant="success" size="sm" className="ms-2" onClick={() => handleAcceptRequest(request.id)}>
                    Accetta
                  </Button>
                  <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeclineRequest(request.id)}>
                    Rifiuta
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Nessuna richiesta di amicizia in sospeso.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRequestsModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
