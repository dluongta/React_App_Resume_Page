import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mainImage from '../../../../assets/main.png';
import './Home.css';

export const Home = ({ className }) => {
  const originalToRotate = [
    "Web Developer",
    "Android Developer",
    "App Developer",
  ];

  const [toRotate, setToRotate] = useState([...originalToRotate, originalToRotate[0]]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLineIndex === toRotate.length - 1) {
        setIsTransitioning(false);
        setCurrentLineIndex(0);

        setTimeout(() => {
          setIsTransitioning(true);
          setCurrentLineIndex(1);
        }, 20);
      } else {
        setIsTransitioning(true);
        setCurrentLineIndex((prevIndex) => prevIndex + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentLineIndex, toRotate.length]);

  return (
    <section className={`home-left ${className}`}>
      <div className="container flex">
        <div className="left">
          <div className="img">
            <img src={mainImage} alt="Dinh Luong Ta Main" />
          </div>
        </div>

        <div className="home-right">
          <div className="content-inner">

            <div style={{ width: '100%', textAlign: 'center', marginBottom: '5px' }}>
              <h1
                className="animated-gradient-text"
                style={{
                  margin: '0',
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontSize: isMobile
                    ? 'clamp(2.4rem, 6vw, 2.5rem)'
                    : 'clamp(1.5rem, 5vw, 3.5rem)',
                  fontWeight: isMobile ? 900 : 800,
                  lineHeight: '1.2',
                  display: 'inline-block'
                }}
              >
                I AM A
              </h1>
            </div>

            <div
              className="headline"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px',
                flexWrap: 'nowrap'
              }}
            >
              <h1
                style={{
                  margin: '0',
                  whiteSpace: 'nowrap',
                  width: 'auto',
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
                className="gradientTextStyleFlexible"
              >
                <div className="carousel_carousel_container">
                  <div
                    className="carousel_carousel"
                    style={{
                      transform: isMobile
                        ? `translateY(calc(-${currentLineIndex * 25}%))`
                        : `translateY(calc(-${currentLineIndex * 25}%))`,
                      transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    }}
                  >
                    {toRotate.map((text, index) => (
                      <div
                        key={index}
                        className="carousel_carousel_item gradientTextStyle"
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </h1>
            </div>

            <div className="socialIcon">
              <a href="https://www.facebook.com/dluongta" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f facebook"></i>
              </a>
              <a href="https://www.instagram.com/dluongta/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/dinh-luong-ta-940ba2286/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin likedin"></i>
              </a>
              <a href="https://www.youtube.com/@dinhluongta" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube youtube"></i>
              </a>
              <a href="https://www.tiktok.com/@dluongta_" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-tiktok tiktok"></i>
              </a>
              <a href="https://github.com/dluongta" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github github"></i>
              </a>
            </div>

            <div className="description-text">
              <p>
                I am Dinh Luong Ta. I am a programmer skilled in Software Development, including Web, Android and Application Development.
                I am extremely fascinated by science, engineering and technology. All of my products are from the TSCEND brand, made by DLUONGTA. With technology continuing to evolve at an unprecedented speed, I would like to develop innovative solutions that have positive and significant impacts on the world.
              </p>

              <p>
                My Resume:
                <Link to="/dluongta_resume.pdf" target="_blank" className="blue-link">
                  Resume Viewer Page
                </Link>
              </p>
            </div>

            <button className="primary-btn btn-led">
              Contact Me
              <span></span><span></span><span></span><span></span>
              <span className="line2"></span><span className="line2"></span>
              <span className="line2"></span><span className="line2"></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};