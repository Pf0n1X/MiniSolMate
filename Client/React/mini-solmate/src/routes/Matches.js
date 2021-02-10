import React, {useRef} from 'react';
import profile_pic from '../images/profile_pic.jpg';
import '../styles/Matches.css';

const Matches = () => {
    const containerEl = useRef(null);
    const cardEl = useRef(null);
    const userPicEl = useRef(null);

    return (
        <div className="container"
            ref={containerEl}
            onMouseMove={event => {
                // let verticalCenter = containerEl.current.offsetTop + containerEl.current.clientHeight / 2;
                // let horizontalCenter = containerEl.current.X + containerEl.current.clientWidth / 2;
                let horizontalCenter = event.currentTarget.getBoundingClientRect().x + containerEl.current.clientWidth / 2;
                let verticalCenter = event.currentTarget.getBoundingClientRect().y + containerEl.current.clientHeight / 2;
                let xAxis = (horizontalCenter - event.screenX) / 25;
                let yAxis = (verticalCenter - event.screenY) / 25;
                console.log("center: " + verticalCenter);
                console.log("screenX: " + event.screenY);
                // console.log(event.clientX)

                cardEl.current.style.transform= `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }}
            onMouseLeave={event => {
                cardEl.current.style.transform= `rotateY(0deg) rotateX(0deg)`;
                cardEl.current.style.transition = 'all 0.5s ease';
                // userPicEl.current.style.transition = 'all 0.5s ease';
                userPicEl.current.style.transform = 'translateZ(0px)';
        }}
            onMouseEnter={event => {
                cardEl.current.style.transition = 'none';
                userPicEl.current.style.transform = 'translateZ(150px)';
            }}>
            <div className="card" ref={cardEl}>
                <div className="user_pic">
                    <div className="circle" />
                    <img ref={userPicEl} src={profile_pic} />
                </div>
                <div className="info">
                    <h1 className="name">User Name</h1>
                    <h3 className="age">Age: 21</h3>
                    <h3 className="description">Music Connects People.</h3>
                </div>
                <div className="mutual_artists">
                    <img src={profile_pic} alt="" className="artist"/>
                    <img src={profile_pic} alt="" className="artist"/>
                    <img src={profile_pic} alt="" className="artist"/>
                </div>
                <div className="buttons">
                    <button className="accept"></button>
                    <button className="decline"></button>
                </div>
            </div>
        </div>
    );
}

export default Matches;