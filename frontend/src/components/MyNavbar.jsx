import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidLogIn } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LOGOUT } from "../redux/actions";
import { GiCartwheel } from "react-icons/gi";
import { MdFirstPage } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaMessage } from "react-icons/fa6";

function MyNavbar() {
  const user = useSelector((state) => state.user);
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
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Link to="/" className="navbar-brand">
              TrailBlazers
            </Link>

            {!user ? (
              <Link to="/login" className="fs-5">
                <BiSolidLogIn /> Login
              </Link>
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
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className="fs-3">
                        TrailBlazers
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Link to={`/dashboard/${user.id}`} className="nav-link fs-5">
                          <GiCartwheel className="me-2" />
                          Profile
                        </Link>
                        <Link to="/Homepage" className="nav-link fs-5">
                          {" "}
                          <FaHome className="me-2" /> Home
                        </Link>
                        <Link to="/Lobbies" className="nav-link fs-5">
                          {" "}
                          <FaMessage className="me-2" /> Chats
                        </Link>
                        <Link to="/" className="nav-link fs-5">
                          <MdFirstPage className="me-2" />
                          Welcome
                        </Link>
                        <hr />
                        <Link onClick={logout} className="nav-link fs-5">
                          <RiLogoutBoxFill className="me-2" />
                          Logout
                        </Link>
                      </Nav>
                    </Offcanvas.Body>
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
