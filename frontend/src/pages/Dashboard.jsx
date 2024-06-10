
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";

function Dashboard() {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState(user.email);

  const handleResetPassword = () => {
    axios.post("/api/forgot-password", { email });
  };

  return (
    <>
      <div className="pt-5">
        <div className="row">
          <div className="col-12 col-md-6">
            <img src={user.profile_img} alt="profile_img" className="img_profile2" />
          </div>
          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-6">
                <p className="fw-bold">
                  User: <span className="text-dark">{user.name}</span>
                </p>
              </div>
              <div className="col-6">
                <p className="fw-bold text-primary">Change</p>
              </div>
              <hr />
              <div className="col-6">
                <p className="fw-bold">
                  Email: <span className="text-dark">{user.email}</span>
                </p>
              </div>
              <div className="col-6">
                <p className="fw-bold text-primary">Change</p>
              </div>
              <hr />
              <div className="col-6">
                <p className="fw-bold">
                  Password: <span className="text-dark">************</span>
                </p>
              </div>
              <div className="col-6">
                <p className="fw-bold text-primary" onClick={handleResetPassword}>
                  Change
                </p>
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
        {/* <form onSubmit={handleResetPassword} style={{ display: "none" }}>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit">Reset Password</button>
                </form> */}
      </div>
    </>
  );
}

export default Dashboard;
