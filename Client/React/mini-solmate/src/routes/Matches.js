import React, { useRef } from 'react';
import profile_pic from '../images/profile_pic.jpg';
import random_chick from '../images/random_chick.jpg';
import billie_eilish from '../images/billie_eilish.jpg';
import '../styles/Matches.css';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import $ from 'jquery';
import Popper from 'popper.js';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';


const Matches = () => {

    return (
        <div className="wrapper">
            <div className="carousel-container">
                <div className="user-name">
                    <h2>
                        Sveta Boronov
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
                    <div className="swipe-button circle1">

                    </div>
                    <div className="swipe-button circle1">

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