import React, { useEffect } from "react";
import profile_pic from "./images/profile_pic.jpg";
import "./App.css";
import {
  FaHeart,
  FaCalculator,
  FaTools,
  FaUser,
  FaMailBulk,
} from "react-icons/fa";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Matches from "./routes/Matches";
import Statics from "./routes/Statics";
import Profile from "./routes/Profile";
import Settings from "./routes/Settings";
import Intro from "./components/Intro";
import Login from "./routes/Login";
import Register from "./routes/Register";
import useToken from "./hooks/useToken";
import axios from "axios";

const App = () => {
  const { isTokenSet, setToken, token } = useToken();

  useEffect(() => {
    axios.defaults.headers.post['Authorization'] = 'Bearer ' + token;
    axios.defaults.headers.get['Authorization'] = 'Bearer ' + token;
    axios.defaults.headers.put['Authorization'] = 'Bearer ' + token;
  }, [isTokenSet]);

  if (!isTokenSet) {
    return (
      <main>
        <section className="glass">
          <div className="dashboard">
            <div className="routes_container">
              <Router>
                <Switch>
                  <Route path="/login" component={Login}>
                    <Login setToken={setToken} />
                  </Route>
                  <Route path="/register" component={Register}>
                    <Register setToken={setToken} />
                  </Route>
                  <Route path="/">
                    <Login setToken={setToken} />
                  </Route>
                </Switch>
              </Router>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="App">
      <Router>
        <main>
          <section className="glass">
            <div className="dashboard">
              <div className="user">
                <img className="profile_img" src={profile_pic} />
                <h3>Tomer Erusalimsky</h3>
                <p>Plays The Ukulele</p>
              </div>
              <div className="links">
                <Link to="/" className="link">
                  <FaHeart size="25px" />
                  <h2>Matches</h2>
                </Link>
                <Link to="/profile" className="link">
                  <FaUser size="25px" />
                  <h2>Profile</h2>
                </Link>
                <Link to="/statics" className="link">
                  <FaCalculator size="25px" />
                  <h2>Statistics</h2>
                </Link>
                <Link to="/chat" className="link">
                  <FaMailBulk size="25px" />
                  <h2>Chat</h2>
                </Link>
                <Link to="/settings" className="link">
                  <FaTools size="25px" />
                  <h2>Settings</h2>
                </Link>
              </div>
            </div>
            <div className="routes_container">
              <Switch>
                <Route path="/login" component={Login}>
                  <Login />
                </Route>
                <Route path="/register" component={Register}>
                  <Register />
                </Route>
                <Route path="/profile" component={Profile}>
                  <Profile />
                </Route>
                <Route path="/statics">
                  <Statics />
                </Route>
                <Route path="/settings">
                  <Settings />
                </Route>
                <Route path="/">
                  <Matches />
                </Route>
              </Switch>
            </div>
          </section>
        </main>
      </Router>
      <Intro />
    </div>
  );
};

export default App;
