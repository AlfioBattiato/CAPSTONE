import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidLogIn } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LOGOUT, RESET_CHATS } from "../redux/actions";
import { IoSettingsOutline } from "react-icons/io5";
import { MdFirstPage } from "react-icons/md";
import { FaStreetView } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";
import { MdOutlineTravelExplore } from "react-icons/md";
import { Button, Form, FormControl, ListGroup } from "react-bootstrap";
import Footer from "./Footer";

function MyNavbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const logout = () => {
    axios.post("/api/logout").then(() => {
      dispatch({ type: LOGOUT });
      dispatch({ type: RESET_CHATS });
      navigate("/");
    });
  };

  const handleclick = () => {
    const navbarbtn = document.getElementsByClassName('navbar-toggler')[0];
    navbarbtn.click();
    window.scroll(0, 0)
  }
  const handleFormClick = () => {
    if (allUsers.length === 0) {
      axios
        .get(`/api/users`)
        .then((response) => {
          setAllUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      const filteredUsers = allUsers.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(filteredUsers);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (userId) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-dark pt-3 sticky" data-bs-theme="dark">
          <Container>
            <Link to="/" className="navbar-brand text-white">
              TrailBlazers
            </Link>

            {!user ? (
              <Button variant="outline-light">
                <Link to="/login" className="fs-6 nav-link fs-5" onClick={handleclick}>
                  <BiSolidLogIn /> Entra
                </Link>
              </Button>
            ) : (
              <>
                <div className="d-flex align-items-center">
                  <Link to={`/profile/${user.id}`} className="nav-link fs-6" onClick={handleclick}>
                    <div className="position-relative">
                      <img src={user.profile_img} alt="Profile" className="img_profile" />
                      <span className="position-absolute translate-middle badge border online rounded-circle bg-success">
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </div>
                  </Link>
                  <Form
                    className="d-flex mx-3 position-relative"
                    onSubmit={(e) => e.preventDefault()}
                    onClick={handleFormClick}
                  >
                    <FormControl
                      type="search"
                      placeholder="Search users"
                      className="me-2"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {searchResults.length > 0 && (
                      <ListGroup className="position-absolute w-100">
                        {searchResults.map((result) => (
                          <ListGroup.Item key={result.id} action onClick={() => handleUserSelect(result.id)}>
                            {result.username}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Form>
                  <Navbar.Toggle
                    aria-controls={`offcanvasNavbar-expand-${expand}`}
                    className="border-0 shadow-0 ms-3"
                  ></Navbar.Toggle>
                  <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                    className="bg-dark text-white"
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="fs-3">
                        TrailBlazers
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Link to={`/profile/${user.id}`} className="nav-link fs-6" onClick={handleclick}>
                          <IoSettingsOutline className="me-2" />
                          Profilo
                        </Link>
                        <Link to="/Homepage" className="nav-link fs-6" onClick={handleclick}>
                          <FaStreetView className="me-2" />
                          Organizza il tuo viaggio
                        </Link>
                        <Link to="/Lobbies" className="nav-link fs-6" onClick={handleclick}>
                          <TiMessages className="me-2" />
                          Messaggi
                        </Link>
                        <Link to="/AllTravels" className="nav-link fs-6" onClick={handleclick}>
                          <MdOutlineTravelExplore className="me-2" />
                          Viaggi utenti
                        </Link>
                        <Link to="/" className="nav-link fs-6" onClick={handleclick}>
                          <MdFirstPage className="me-2" />
                          Benvenuto
                        </Link>
                        <hr />
                        <Link onClick={() => { logout(); handleclick(); }} className="nav-link fs-6">
                          <RiLogoutBoxFill className="me-2" />
                          Esci
                        </Link>
                      </Nav>
                    </Offcanvas.Body>
                    <Footer />
                  </Navbar.Offcanvas>
                </div>
              </>
            )}
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default MyNavbar;
