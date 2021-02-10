import logo from './logo.svg';
import profile_pic from './images/profile_pic.jpg';
import './App.css';
import { FaHeart, FaPersonBooth } from 'react-icons/fa';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Matches from './routes/Matches';
import Events from './routes/Events';
import Profile from './routes/Profile';
import Settings from './routes/Settings';

function App() {
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
                  {/* <img src={profile_pic} /> */}
                  <FaHeart />
                  <h2>Matches</h2>
                </Link>
                <Link to="/profile" className="link">
                  <FaHeart />
                  <h2>Profile</h2>
                </Link>
                <Link to="/events" className="link">
                  <FaHeart />
                  <h2>Events</h2>
                </Link>
                <Link to="/settings" className="link">
                  <FaHeart />
                  <h2>Settings</h2>
                </Link>
              </div>
              {/* <div className="pro">
              <h2>Go Pro for better matches.</h2>
              <img src={profile_pic} />
            </div> */}
            </div>
            <div className="routes_container">
              <Switch>
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
    </div>
  );
}

export default App;
