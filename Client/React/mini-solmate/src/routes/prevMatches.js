import React, {useRef} from 'react';
import profile_pic from '../images/profile_pic.jpg';
import '../styles/Matches.css';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';

const prevMatches = () => {
    const containerEl = useRef(null);
    const cardEl = useRef(null);
    const userPicEl = useRef(null);
    const infoEl = useRef(null);
    const mutualArtistsEl = useRef(null);

    return (
        <div className="container"
            ref={containerEl}
            onMouseMove={event => {
                // let verticalCenter = containerEl.current.offsetTop + containerEl.current.clientHeight / 2;
                // let horizontalCenter = containerEl.current.X + containerEl.current.clientWidth / 2;
                let horizontalCenter = event.currentTarget.getBoundingClientRect().x + containerEl.current.clientWidth / 2;
                let verticalCenter = event.currentTarget.getBoundingClientRect().y + containerEl.current.clientHeight / 2;
                let xAxis = (horizontalCenter - event.pageX) / 25;
                let yAxis = (verticalCenter - event.pageY) / 25;
                console.log("center: " + verticalCenter);
                console.log("screenX: " + event.screenY);
                // console.log(event.clientX)

                cardEl.current.style.transform= `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }}
            onMouseLeave={event => {
                cardEl.current.style.transform= `rotateY(0deg) rotateX(0deg)`;
                cardEl.current.style.transition = 'all 0.5s ease';
                // userPicEl.current.style.transition = 'all 0.5s ease';
                userPicEl.current.style.transform = 'translateZ(0px) rotateZ(0deg)';
                infoEl.current.style.transform = 'translateZ(0px)';
                mutualArtistsEl.current.style.transform = 'translateZ(0px)';
        }}
            onMouseEnter={event => {
                cardEl.current.style.transition = 'none';
                userPicEl.current.style.transform = 'translateZ(150px) rotateZ(-10deg)';
                infoEl.current.style.transform = 'translateZ(175px)';
                mutualArtistsEl.current.style.transform = 'translateZ(150px)';
            }}>
            <button className="swipe_button decline"><FaHeartBroken /></button>
            <div className="card" ref={cardEl}>
                <div className="user_pic">
                    <div className="circle" />
                    <img ref={userPicEl} src={profile_pic} />
                </div>
                <div ref={infoEl} className="info">
                    <h1 className="name">User Name</h1>
                    <h3 className="age">Age: 21</h3>
                    <h3 className="description">Music Connects People.</h3>
                </div>
                <div ref={mutualArtistsEl} className="mutual_artists">
                    <img src={profile_pic} alt="" className="artist"/>
                    <img src={profile_pic} alt="" className="artist"/>
                    <img src={profile_pic} alt="" className="artist"/>
                </div>
                <div className="buttons">
                    <button className="accept"></button>
                    <button className="decline"></button>
                </div>
            </div>
            <button className="swipe_button accept"><FaHeart color={"#585858"} /></button>
        </div>
    );
}

export default prevMatches;