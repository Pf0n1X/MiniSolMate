import React, { useContext, useEffect, useState } from 'react';
import { userContext } from "./context/userContext";
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
import { Redirect } from "react-router-dom";

const App = () => {
  const { isTokenSet, setToken, token } = useToken();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const uCon = useContext(userContext);

  useEffect(() => {
    if (uCon.state.user) {
      uCon.fetch(uCon.state.user.email);
    }
  }, [uCon.state.user]);

  useEffect(() => {

    if (uCon.data !== null && uCon.data !== undefined && uCon.data != {}) {
      setFirstName(uCon.data.firstName);
      setLastName(uCon.data.lastName);
      setProfilePic(uCon.data.picture);
    }

  }, [uCon]);

  const openChat = () => {
    window.open('http://localhost:4200/', '_blank');
  };

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
                <img className="profile_img" src={`http://localhost:3001/static/${profilePic}`} />
                <h3>{firstName} {lastName}</h3>
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
                <Link to="" onClick={openChat} className="link">
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
                <Route path="/profile" component={Profile}>
                  <Profile />
                </Route>
                <Route path="/statics">
                  <Statics />
                </Route>
                <Route path="/settings">
                  <Settings />
                </Route>
                <Redirect from='/login' to="/" >
                  <Matches />
                </Redirect>
                <Redirect from='/register' to="/" >
                  <Matches />
                </Redirect>
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
