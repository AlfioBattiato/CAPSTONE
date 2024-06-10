import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';

function Dashboard() {
    const user = useSelector((state) => state.user);
    const [email, setEmail] = useState(user.email);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleResetPassword = () => {
        axios.post("/api/forgot-password", { email })
            .then((res) => {
                console.log(res)
                setMessage(res.data.status);
                setError(null);
            })
            .catch((err) => {
                console.log(err)

                setMessage(null);
                setError(err.message);
            });
    };

    useEffect(() => {
      
    }, [message, error]);

    return (
        <div className="container pt-5">
            <div className="row">
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
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
        </div>
    );
}

export default Dashboard;
