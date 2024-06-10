import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { LOGIN } from "../redux/actions";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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

  const submitLogin = async (ev) => {
    ev.preventDefault();

    try {
      await axios.post("/api/login", formData);
      const res = await axios.get("/api/user");

      // salvare i dati dello user nel Redux state
      dispatch({
        type: LOGIN,
        payload: res.data,
      });
      navigate("/homepage");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <>
      <div className="container my-5 py-5">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={(ev) => submitLogin(ev)} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={(ev) => updateInputValue(ev)}
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
              onChange={(ev) => updateInputValue(ev)}
              value={formData.password}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <div className="mt-5 pt-5">
          <Link to={`/Register/`} className=" fw-bold txt-primary ">
            Non sei registrato?
          </Link>
        </div>
      </div>
    </>
  );
}
export default Login;
