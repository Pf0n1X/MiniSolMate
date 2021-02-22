import React, { useEffect } from 'react';
import profile_pic from './images/profile_pic.jpg';
import './App.css';
import { FaHeart, FaCalendar, FaTools, FaUser, FaMailBulk } from 'react-icons/fa';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Matches from './routes/Matches';
import Events from './routes/Events';
import Profile from './routes/Profile';
import Settings from './routes/Settings';
import Intro from './components/Intro';
import Login from './routes/Login';

const App = () => {

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
                <Link to="/events" className="link">
                  <FaCalendar size="25px" />
                  <h2>Events</h2>
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
                <Route path="/login" component={Profile}>
                  <Login />
                </Route>
                <Route path="/profile" component={Profile}>
                  <Profile />
                </Route>
                <Route path="/events">
                  <Events />
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
}

export default App;
