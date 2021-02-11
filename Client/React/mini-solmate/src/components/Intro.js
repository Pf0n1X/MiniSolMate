import React, { useEffect } from "react";
import '../styles/Intro.css';
import gsap from 'gsap';

const Intro = () => {

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });
        tl.to('.text', { y: "0%", duration: 1, stagger: 0.25 });
        tl.to('.slider', { y: "-100%", duration: 1.5, delay: 0.5 });
        tl.to('.intro', { y: "-100%", duration: 1 }, "-=1.1");
        tl.fromTo('.glass', { opacity: 0 }, { opacity: 1, duration: 1 });
    }, []);

    return (
        <>
            <div className="intro">
                <div className="intro-text">
                    <h1 className="hide">
                        <span className="text">Music</span>
                    </h1>
                    <h1 className="hide">
                        <span className="text">Connects</span>
                    </h1>
                    <h1 className="hide">
                        <span className="text">People.</span>
                    </h1>
                </div>
            </div>
            <div className="slider"></div>
        </>
    );
}

export default Intro;