// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate,  } from 'react-router-dom';
import { BiSolidLogIn } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { LOGOUT } from '../redux/actions';
// import { CgMenuGridR } from "react-icons/cg";


function MyNavbar() {
  // const location = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    axios.post("api/logout").then(() => {
      dispatch({ type: LOGOUT });
      navigate("/");
    });
  };
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
          <Link to={'/'}className='navbar-brand'>TrailBlazers </Link>

            {!user ? <Link to={'/login'} > <BiSolidLogIn />Login</Link>
              : (
                <>
                  <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}
                    className='border-0'>

                  </Navbar.Toggle>
                  <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                        TrailBlazers
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <Nav className="justify-content-end flex-grow-1 pe-3">

                        <>
                          <Link  to={`/dashboard/${user.id}`}>Profile</Link>
                          <Link to={'/'}>Welcome</Link>
                          <Link to={'/Homepage'}>Home</Link>
                          <Link onClick={logout} className="dropdown-item border-0 ps-1">
                          Logout
                        </Link>
                          {/* <Nav.Link href="#action2">Link</Nav.Link> */}

                          {/* <Form className="d-flex">
                        <Form.Control
                          type="search"
                          placeholder="Search"
                          className="me-2"
                          aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                      </Form> */}
                        </>


                      </Nav>

                    </Offcanvas.Body>
                  </Navbar.Offcanvas></>
              )
            }

          </Container >
        </Navbar >
      ))
      }
    </>
  );
}

export default MyNavbar;