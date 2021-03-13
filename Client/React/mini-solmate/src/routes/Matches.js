import React, { useEffect, useContext, useState } from "react";
import profile_pic from "../images/profile_pic.jpg";
import random_chick from "../images/random_chick.jpg";
import "../styles/Matches.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import { userContext } from "../context/userContext";
import useToken from "../hooks/useToken";
import gsap from 'gsap';

const Matches = () => {
  const [user, setUser] = useState();
  const [match, setMatch] = useState();
  const uCon = useContext(userContext);
  const { token } = useToken();
  const [isMatchFound, setIsMatchFound] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });
    tl.to('.not-found-header', { delay: 5, opacity: "1", duration: 1, stagger: 0.25 });
    // tl.to('.main-header', { opacity: "1", duration: 1, stagger: 0.25 });
}, []);

  const calcNewMatches = () => {

    // Add new matches
    axios
      .post("http://localhost:3001/match/calc/?userId=" + uCon.state.user["_id"])
      .then((response) => {
        if (response.data === null || response.data === undefined) return;

        console.log(response.data);
        getMatch();
      });
  };

  const getMatch = () => {

    // Get the match from the server.
    axios
      .get("http://localhost:3001/match?userId=" + uCon.state.user["_id"])
      .then((response) => {
        if (response.data === null || response.data === undefined || response.data.length === 0) {
          // TODO: Show a no matches found page
          setIsMatchFound(false);
          return;
        }
        
        setIsMatchFound(true);
        console.log(response.data);
        setMatch(response.data);

        // Check which one of the the user fields is the other user
        // and set the state accordingly.
        if (response.data.firstUser._id === uCon.state.user["_id"]) {
          setUser(response.data.secondUser);
        } else {
          setUser(response.data.firstUser);
        }
      });
  };

  const onUpdateMatchButtonClicked = (isAccept) => {
    if (match === null) return;

    if (match.firstUser._id === uCon.state.user["_id"]) {
      match.Approve1 = isAccept;
    } else {
      match.Approve2 = isAccept;
    }

    axios.put("http://localhost:3001/match", match).then(() => {
      // Get a new match.
      console.log("Getting a new match");
      getMatch();
    });
  };

  const renderSongs = () => {
    var domSongs = [];

    for (var i = 0; i < user?.Songs?.length && i < 3; i++) {
      domSongs.push(
        <div className="song" key={i}>
          <img src={user?.Songs[i]?.imgUrl} alt="" className="song-img" />
          <span>{user?.Songs[i]?.songName}</span>
        </div>
      );
    }

    return domSongs;
  };

  const renderCarouselItems = () => {
    if (user?.Media.length > 0) {
      return user?.Media.map((pic, index) =>
      (<Carousel.Item key={index}>
        <img
          className="d-block w-100 carousel-img"
          src={`http://localhost:3001/static/${pic}`}
        />
      </Carousel.Item>)
      );
    } else {
      return (<Carousel.Item key="random_key">
        <img
          className="d-block w-100 carousel-img"
          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
        />
      </Carousel.Item>)
    }
  }

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }, []);

  useEffect(() => {
    if (uCon.state.user) {
      calcNewMatches();
    }
  }, [uCon.state.user]);

  return isMatchFound ? (
    <div className="wrapper">
      <div className="carousel-container">
        <div className="user-name">
          <h1>
            {user?.firstName} {user?.lastName}
          </h1>
        </div>

        <Carousel>
          {renderCarouselItems()}
        </Carousel>
        <div className="swipe-buttons">
          <div
            className="swipe-button circle1 button-decline"
            onClick={() => {
              onUpdateMatchButtonClicked(false);
            }}
          >
            <SentimentVeryDissatisfiedIcon style={{ fontSize: 30 }} />
          </div>
          <div
            className="swipe-button circle1 button-accept"
            onClick={() => {
              onUpdateMatchButtonClicked(true);
            }}
          >
            <SentimentVerySatisfiedIcon style={{ fontSize: 30 }} />
          </div>
        </div>
      </div>
      <div className="user-info">
        <div className="bio">
          <h3>Bio</h3>
          <section>{user?.description}</section>
          <img src={`http://localhost:3001/static/${user?.picture}`} />
        </div>
        <div className="top-songs">
          <h3>Top Songs</h3>
          <section>{renderSongs()}</section>
        </div>
      </div>
    </div>
  )
  : 
  (<div className="not-found-container">
    <h1 className="not-found-header main-header">No Matches Found.</h1>
    <h3 className="not-found-header sub-header">Try Again Later.</h3>
  </div>);
};

export default Matches;