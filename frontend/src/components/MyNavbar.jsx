import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidLogIn } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LOGOUT } from "../redux/actions";
import { IoSettingsOutline } from "react-icons/io5";
import { MdFirstPage } from "react-icons/md";
import { FaStreetView  } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";
import { MdOutlineTravelExplore } from "react-icons/md";
import { Button } from "react-bootstrap";
import Footer from "./Footer";
function MyNavbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    axios.post("/api/logout").then(() => {
      dispatch({ type: LOGOUT });
      navigate("/");
    });
  };

  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className=" bg-dark pt-3" data-bs-theme="dark">
          <Container >

            <Link to="/" className="navbar-brand text-white ">
              TrailBlazers
            </Link>

            {!user ? (
              <Button variant="outline-light">
                <Link to="/login" className="fs-6 nav-link fs-5">
                  <BiSolidLogIn /> Entra
                </Link>
              </Button>
            ) : (
              <>
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                    <img src={user.profile_img} alt="Profile" className="img_profile" />
                    <span className="position-absolute translate-middle badge border online rounded-circle bg-success">
                      <span className="visually-hidden">unread messages</span>
                    </span>
                  </div>
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
                        <Link to={`/dashboard/${user.id}`} className="nav-link fs-6">
                          <IoSettingsOutline  className="me-2" />
                          Profilo
                        </Link>
                        <Link to="/Homepage" className="nav-link fs-6">
                          {" "}
                          <FaStreetView className="me-2" />Organizza il tuo viaggio
                        </Link>
                        <Link to="/Lobbies" className="nav-link fs-6">
                          {" "}
                          <TiMessages className="me-2" />Messaggi
                        </Link>
                        <Link to="/AllTravels" className="nav-link fs-6">
                          {" "}
                          <MdOutlineTravelExplore className="me-2" />Viaggi utenti
                        </Link>
                        <Link to="/" className="nav-link fs-6">
                          <MdFirstPage className="me-2" />
                          Benvenuto
                        </Link>
                        <hr />
                        <Link onClick={logout} className="nav-link fs-6">
                          <RiLogoutBoxFill className="me-2" />
                          Esci
                        </Link>
                      </Nav>
                    </Offcanvas.Body>
                    <Footer></Footer>
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
