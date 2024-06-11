import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { LOGIN } from "../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const updateInputValue = (ev) => {
    setFormData((oldFormData) => ({
      ...oldFormData,
      [ev.target.name]: ev.target.value,
    }));
  };

  const [show, setShow] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setResetEmail(formData.email);
    setShow(true);
  };

  const handleResetEmailChange = (ev) => {
    setResetEmail(ev.target.value);
  };

  const handleResetPassword = () => {
    setSpinner(true);
    axios
      .post("/api/forgot-password", { email: resetEmail })
      .then((res) => {
        setMessage(res.data.status);
        setError(null);
        setSpinner(false);
        handleClose();
      })
      .catch((err) => {
        setMessage(null);
        setError(err.response.data.message);
        setSpinner(false);
        handleClose();
      });
  };

  const submitLogin = async (ev) => {
    ev.preventDefault();

    try {
      await axios.post("/api/login", formData);
      const res = await axios.get("/api/user");

      // Salvare i dati dello user nel Redux state
      dispatch({
        type: LOGIN,
        payload: res.data,
      });
      navigate("/homepage/");
    } catch (err) {
      setError(err.response.data.message);
      setMessage(null);
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <>
      <div className="container my-5 py-5">
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <form onSubmit={submitLogin} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={updateInputValue}
              value={formData.email}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={updateInputValue}
              value={formData.password}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <div className="mt-5 pt-5">
          <p className="fw-bold text-primary" onClick={handleShow}>
            Password dimenticata?
          </p>
          <hr />
          <Link to={`/Register/`} className="fw-bold text-success">
            Crea nuovo account?
          </Link>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Reset password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <label htmlFor="reset-email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="reset-email"
                  name="reset-email"
                  onChange={handleResetEmailChange}
                  value={resetEmail}
                />
                <Button variant="primary" onClick={handleResetPassword} className="mt-2" disabled={spinner}>
                  {spinner ? "Please wait..." : "Reset Password"}
                </Button>
              </form>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Login;
