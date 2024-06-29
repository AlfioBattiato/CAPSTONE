import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { LOGIN } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_img: "",
  });

  const updateInputValue = (ev) => {
    setFormData((oldFormData) => ({
      ...oldFormData,
      [ev.target.name]: ev.target.value,
    }));
  };

  const updateImageField = (ev) => {
    updateInputValue(ev);
    setProfileImage(ev.target.files[0]);
  };

  const submitLogin = (ev) => {
    ev.preventDefault();
    // gli indirizzi relativi, con il proxy attivo fanno la richiesta a http://localhost:8000/login mascherandolo come indirizzo nello stesso host di react (che nel nostro caso è http://localhost:3000/login)
    axios
      .get("/sanctum/csrf-cookie")
      .then(() => {
        const body = new FormData();
        body.append("username", formData.username);
        body.append("email", formData.email);
        body.append("password", formData.password);
        body.append("password_confirmation", formData.password_confirmation);
        if (profileImage) {
          body.append("profile_img", profileImage);
        }

        return axios.post("/api/register", body);
      })
      .then(() => axios.get("/api/user"))
      .then((res) => {
        navigate("/");
        dispatch({
          type: LOGIN,
          payload: res.data,
        });
      });
    // .catch((err) => {
    //     console.log(err.response.data.errors);
    //     setErrors(err.response.data.errors);
    // });
  };

  return (
    // <form method="POST" action="....." novalidate enctype='multipart/form-data'> // se fatto in Blade
    <Container className="d-flex justify-content-center align-items-start mt-5" style={{ height: "100vh" }}>
      <div className="w-75 p-5 mt-5 lobbies bg-light">
        <form onSubmit={(ev) => submitLogin(ev)} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-bold">
              Username
            </label>
            <input
              type="text"
              className="form-control search-input rounded-pill"
              id="username"
              name="username"
              onChange={(ev) => updateInputValue(ev)}
              value={formData.username}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email address
            </label>
            <input
              type="email"
              className="form-control search-input rounded-pill"
              id="email"
              name="email"
              onChange={(ev) => updateInputValue(ev)}
              value={formData.email}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              type="password"
              className="form-control search-input rounded-pill"
              id="password"
              name="password"
              onChange={(ev) => updateInputValue(ev)}
              value={formData.password}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password_confirmation" className="form-label fw-bold">
              Conferma password
            </label>
            <input
              type="password"
              className="form-control search-input rounded-pill"
              id="password_confirmation"
              name="password_confirmation"
              onChange={(ev) => updateInputValue(ev)}
              value={formData.password_confirmation}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="profile_img" className="form-label fw-bold">
              Profile image
            </label>
            <input
              className="form-control search-input rounded-pill"
              type="file"
              id="profile_img"
              name="profile_img"
              onChange={(ev) => updateImageField(ev)}
              value={formData.profile_img}
            />
          </div>
          <button type="submit" className="btn gradient-orange text-white border-0">
            Register
          </button>
        </form>
      </div>
    </Container>
  );
};

export default Register;
