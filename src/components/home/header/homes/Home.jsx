import React from 'react';
import { Link } from 'react-router-dom';
import RotatingText from './RotatingText';
import './RotatingText.css'; // Đảm bảo đã import CSS
import './Home.css';

export const Home = ({ className }) => {
  const textToRotate = [
    "Proficient Programmer", 
    "Software Developer", 
    "Hardware Engineer"
  ];

  return (
    <>
      <section className={`home ${className}`}>
        <div className="container single-column">
          <div className="content-wrapper">
            
            <div className="headline" style={{ width: '100%', textAlign: 'center' }}>
  <h1 className="gradientTextStyle" style={{ marginBottom: '10px' }}>I AM A</h1>
  
  <h1 style={{ display: 'block', width: '100%' }}>
    <RotatingText
      texts={textToRotate}
      mainClassName="rotating-text-highlight"
      staggerFrom="last"
      staggerDuration={0.025}
      rotationInterval={3000}
      //splitBy="words"
      splitBy="characters" 
    />
  </h1>
</div>

            <div className="socialIcon">
              <Link to={{ pathname: 'https://www.facebook.com/dluongta' }} target="_blank">
                <i className="fab fa-facebook-f facebook"></i>
              </Link>
              <Link to={{ pathname: 'https://www.instagram.com/dluongta/' }} target="_blank">
                <i className="fab fa-instagram instagram"></i>
              </Link>
              <Link to={{ pathname: 'https://www.linkedin.com/in/dinh-luong-ta-940ba2286/' }} target="_blank">
                <i className="fab fa-linkedin likedin"></i>
              </Link>
              <Link to={{ pathname: 'https://www.youtube.com/@dinhluongta' }} target="_blank">
                <i className="fab fa-youtube youtube"></i>
              </Link>
              <Link to={{ pathname: 'https://www.tiktok.com/@dluongta_' }} target="_blank">
                <i className="fab fa-tiktok tiktok"></i>
              </Link>
              <Link to={{ pathname: 'https://github.com/dluongta' }} target="_blank">
                <i className="fab fa-github github"></i>
              </Link>
            </div>

            <p>
              I am Dinh Luong Ta. I am a programmer skilled at Web Development,
              Android Development. I am also learning Artificial Intelligence and Hardware.
              I am extremely fascinated by science and technology. All of my products are ULTRAMIND generation made by DLUONGTA.
            </p>

            <p>
              My Resume:
              <Link to={{ pathname: '/Resume.pdf' }} target="_blank" className="blue">
                Resume Viewer Page
              </Link>
            </p>

            <div className="btn-pulse-wrapper">
              <span className="pulse-third"></span>
              <button className="primary-btn btn-led">
                Contact Me
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span className="line2"></span>
                <span className="line2"></span>
                <span className="line2"></span>
                <span className="line2"></span>
              </button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};