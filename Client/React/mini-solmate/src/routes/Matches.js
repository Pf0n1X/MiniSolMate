import React, { useEffect, useRef, useState } from 'react';
import profile_pic from '../images/profile_pic.jpg';
import random_chick from '../images/random_chick.jpg';
import billie_eilish from '../images/billie_eilish.jpg';
import '../styles/Matches.css';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import $ from 'jquery';
import Popper from 'popper.js';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Button } from 'bootstrap';


const Matches = () => {

    // TODO: Replace with the actual id of the connected user.
    const CONNECTED_USER_ID = '604639ae4ad4fa1dcc6822e5';

    const [user, setUser] = useState();
    const [match, setMatch] = useState();

    const getMatch = () => {
        // Get the match from the server.
        axios.get('http://localhost:3001/match?userId=' + CONNECTED_USER_ID)
            .then((response) => {
                if (response.data === null)
                    return;

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

    useEffect(() => {
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
                        {/* <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carousel-img"
                            src={random_chick}
                            alt="First slide"
                        />
                        {/* <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                </Carousel>
                <div className="swipe-buttons">
                    <div className="swipe-button circle1 button-accept" onClick={() => { onUpdateMatchButtonClicked(true); }}>
                        {/* <button onClick={() => { onUpdateMatchButtonClicked(true); }} /> */}
                    </div>
                    <div className="swipe-button circle1 button-decline" onClick={() => { onUpdateMatchButtonClicked(false); }}>
                        {/* <button onClick={() => { onUpdateMatchButtonClicked(false); }} /> */}
                    </div>
                </div>
            </div>
            <div className="user-info">
                <div className="bio">
                    <h3>Bio</h3>
                    <section>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    </section>
                </div>
                <div className="top-artists">
                    <h3>Top Artists</h3>
                    <section>
                        <div className="artist">
                            <img src={billie_eilish} alt="" className="artist-img" />
                            <span>Billie Eilish</span>
                        </div>
                        <div className="artist">
                            <img src={billie_eilish} alt="" className="artist-img" />
                            <span>Billie Eilish</span>
                        </div>
                        <div className="artist">
                            <img src={billie_eilish} alt="" className="artist-img" />
                            <span>Billie Eilish</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Matches;