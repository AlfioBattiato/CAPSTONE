import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavbar";
import Welcome from "./pages/Welcome";
import { useDispatch } from "react-redux";
import Login from "./pages/Login";
import axios from "axios";
import { useEffect, useState } from "react";
import { LOGIN } from "./redux/actions";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Homepage from "./pages/Homepage";
import AllTravels from "./pages/AllTravels";
import Dashboard from "./pages/Dashboard";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import Lobbies from "./pages/Lobbies";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import 'react-multi-carousel/lib/styles.css';
import CreateInterestPlace from "./components/interest_places/CreateInterestPlace";


function App() {
  // const user = useSelector((state) => state.user);
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  const client = new Ably.Realtime({ key: "uRBb4w.1DCh6w:E3_xBUxVrZui2ADTydJ8-T330Gp0YO9GwNabh6lcKxM" });

  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios("/api/user")
      .then((res) =>
        dispatch({
          type: LOGIN,
          payload: res.data,
        })
      )
      .catch((err) => console.log(err))
      .finally(() => setLoaded(true));
  }, [dispatch]);

  return (
    loaded && (
      <AblyProvider client={client}>
        <BrowserRouter>
          <MyNavbar></MyNavbar>
          <Routes>
            <Route path="/" element={<Welcome />} />
            {/* <Route path="/detail/:id" element={<Detail />} /> */}
            <Route path="/login/" element={<Login />} />
            <Route path="/Register/" element={<Register />} />
            <Route path="/AllTravels/" element={<AllTravels />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/password-reset/:token" element={<PasswordReset />} />
              <Route path="/dashboard/:id" element={<Dashboard />} />
              <Route path="/homepage/" element={<Homepage />} />
              <Route path="/createInterestPlace" element={<CreateInterestPlace />} />

              <Route
                path="/lobbies"
                element={
                  <ChannelProvider channelName="global">
                    <Lobbies />
                  </ChannelProvider>
                }
              />

              {/* <Route path="/corsiutente/:id" element={<CorsiUtente />} /> */}
            </Route>

            {/* <Route path="/Register/" element={<Register />} />
        <Route path="/backoffice/" element={<Backoffice />} /> */}

            {/* {user=== null &&(
                <Route path="/" element={<Login />} />

            )} */}

            {/* rotte accessibili da tutti */}

            {/* rotte accessibili solo se sei loggato */}
            {/* <Route element={<ProtectedRoutes />}>
                <Route
                    path="/faculties/:id"
                    element={<FacultyPage />}
                />
                <Route
                    path="/transcript"
                    element={<Transcript />}
                />
            </Route> */}

            {/* rotte accessibili solo se NON sei loggato */}

            {/* <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} /> */}
          </Routes>
        </BrowserRouter>
      </AblyProvider>
    )
  );
}

export default App;
