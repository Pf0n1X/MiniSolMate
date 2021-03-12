import React, { useEffect, useContext, useState } from 'react';
import profile_pic from '../images/profile_pic.jpg';
import random_chick from '../images/random_chick.jpg';
import '../styles/Matches.css';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { userContext } from "../context/userContext";


const Matches = () => {

    // TODO: Replace with the actual id of the connected user.
    const CONNECTED_USER_ID = '604639ae4ad4fa1dcc6822e5';

    const [user, setUser] = useState();
    const [match, setMatch] = useState();
    const a = useContext(userContext);

    const getMatch = () => {
        // Get the match from the server.
        axios.get('http://localhost:3001/match?userId=' + CONNECTED_USER_ID)
            .then((response) => {
                if (response.data === null)
                    return;

                console.log(response.data)
                setMatch(response.data)
        
                // Check which one of the the user fields is the other user
                // and set the state accordingly.
                if (response.data.firstUser._id === CONNECTED_USER_ID) {
                    setUser(response.data.secondUser)
                } else {
                    setUser(response.data.firstUser)
                }
            });
    }

    const onUpdateMatchButtonClicked = (isAccept) => {
        if (match === null)
            return;
            
        if (match.firstUser._id === CONNECTED_USER_ID) {
            match.Approve1 = isAccept;
        } else {
            match.Approve2 = isAccept;
        }

        axios.put('http://localhost:3001/match', match)
            .then((a, b) => {
                console.log(a);
                console.log(b);

                // Get a new match.
                console.log("Getting a new match")
                getMatch();
            });
    }

    const renderSongs = () => {
        var domSongs = [];

        for (var i = 0; i < user?.Songs?.length && i < 3; i++) {
            domSongs.push(
            <div className="song">
                <img src={user?.Songs[i]?.imgUrl} alt="" className="song-img" />
                <span>{user?.Songs[i]?.songName}</span>
            </div>);
        }

        return domSongs;
    }

    useEffect(() => {
        console.log("The user is");
        console.log(a)
        getMatch();
    }, []);

    return (
        <div className="wrapper">
            <div className="carousel-container">
                <div className="user-name">
                    <h2>
                        {user?.firstName} {user?.lastName}
                </h2>
                </div>
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carousel-img"
                            src={profile_pic}
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carousel-img"
                            src={random_chick}
                            alt="First slide"
                        />
                    </Carousel.Item>
                </Carousel>
                <div className="swipe-buttons">
                    <div className="swipe-button circle1 button-decline" onClick={() => { onUpdateMatchButtonClicked(false); }}>
                        {/* <button onClick={() => { onUpdateMatchButtonClicked(false); }} /> */}
                        <SentimentVeryDissatisfiedIcon style={{ fontSize: 30 }} />

                    </div>
                    <div className="swipe-button circle1 button-accept" onClick={() => { onUpdateMatchButtonClicked(true); }}>
                        {/* <button onClick={() => { onUpdateMatchButtonClicked(true); }} /> */}
                        <SentimentVerySatisfiedIcon style={{ fontSize: 30 }} />
                    </div>
                </div>
            </div>
            <div className="user-info">
                <div className="bio">
                    <h3>Bio</h3>
                    <section>
                        {user?.description}
                    </section>
                </div>
                <div className="top-songs">
                    <h3>Top Songs</h3>
                    <section>
                        {renderSongs()}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Matches;