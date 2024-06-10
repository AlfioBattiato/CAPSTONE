import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../redux/actions";

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
    <div className="container-fluid">
      <h1>Reset della Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nuova Password:
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              className="mt-2"
            />
          </label>
        </div>
        <div>
          <label>
            Conferma Nuova Password:
            <br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              name="password_confirmation"
              className="mt-2"
            />
          </label>
        </div>
        <button type="submit" className="mt-2">
          Reset Password
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordReset;
