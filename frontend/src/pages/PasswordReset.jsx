import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../redux/actions";
import { Container } from "react-bootstrap";

const PasswordReset = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/reset-password", {
        email,
        password,
        password_confirmation: confirmPassword,
        token,
      });

      dispatch({ type: LOGOUT });
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-start pt-5 mt-5" style={{ height: "100vh" }}>
      <div className="w-50 p-5 mt-5 lobbies bg-light">
        <h1 className="fw-bold mb-3">Reset della Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Nuova Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              className="form-control search-input w-75"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Conferma Nuova Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              name="password_confirmation"
              className="form-control search-input w-75"
            />
          </div>
          <div className="text-end pt-3">
            <button type="submit" className="mt-2 btn gradient-orange text-white border-0">
              Reset Password
            </button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </Container>
  );
};

export default PasswordReset;
