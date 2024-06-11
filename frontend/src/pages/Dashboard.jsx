import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

function Dashboard() {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const handleResetPassword = () => {
    setSpinner(true);
    axios
      .post("/api/forgot-password", { email })
      .then((res) => {
        setMessage(res.data.status);
        setSpinner(false);

        setError(null);
      })
      .catch((err) => {
        console.log(err);

        setMessage(null);
        setError(err.response.data.message);
        setSpinner(false);
      });
  };

  useEffect(() => {}, [message, error]);

  return (
    <div className="container pt-5">
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="row p-5 w-100">
        <div className="col-12 col-md-4">
          <img src={user.profile_img} alt="profile_img" className="img_profile2" />
        </div>
        <div className="col-12 col-md-8">
          <div className="row">
            <div className="col-6">
              <p className="fw-bold">
                User: <span className="text-dark">{user.username}</span>
              </p>
            </div>
            <div className="col-6">
              <p className="fw-bold text-primary btn">Change</p>
            </div>
            <hr />
            <div className="col-6">
              <p className="fw-bold">
                Email: <span className="text-dark">{user.email}</span>
              </p>
            </div>
            <div className="col-6">
              <p className="fw-bold text-primary btn">Change</p>
            </div>
            <hr />
            <div className="col-6">
              <p className="fw-bold">
                Password: <span className="text-dark">************</span>
              </p>
            </div>
            <div className="col-6">
              {spinner ? (
                <Spinner animation="grow" size="sm" />
              ) : (
                <p className="fw-bold text-primary btn" onClick={handleResetPassword}>
                  Change
                </p>
              )}
            </div>
            <hr />
            <div className="col-6">
              <p className="fw-bold">
                Created at: <span className="text-dark">{user.created_at.slice(0, 10)}</span>
              </p>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
