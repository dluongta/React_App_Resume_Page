// import React from 'react';
// import { Link } from 'react-router-dom';
// import RotatingText from './RotatingText';
// import './RotatingText.css';
// import './Home.css';

// export const Home = ({ className }) => {
//   const textToRotate = [
//     "Proficient Programmer", 
//     "Software Developer", 
//     "Hardware Engineer"
//   ];

//   return (
//     <>
//       <section className={`home ${className}`}>
//         <div className="container single-column">
//           <div className="content-wrapper">

//             <div className="headline" style={{ width: '100%', textAlign: 'center' }}>
//   <h1 className="gradientTextStyle" style={{ marginBottom: '10px' }}>I AM A</h1>

//   <h1 style={{ display: 'block', width: '100%' }}>
//     <RotatingText
//       texts={textToRotate}
//       mainClassName="rotating-text-highlight"
//       staggerFrom="last"
//       staggerDuration={0.025}
//       rotationInterval={3000}
//       //splitBy="words"
//       splitBy="characters" 
//     />
//   </h1>
// </div>

//             <div className="socialIcon">
//               <Link to={{ pathname: 'https://www.facebook.com/dluongta' }} target="_blank">
//                 <i className="fab fa-facebook-f facebook"></i>
//               </Link>
//               <Link to={{ pathname: 'https://www.instagram.com/dluongta/' }} target="_blank">
//                 <i className="fab fa-instagram instagram"></i>
//               </Link>
//               <Link to={{ pathname: 'https://www.linkedin.com/in/dinh-luong-ta-940ba2286/' }} target="_blank">
//                 <i className="fab fa-linkedin likedin"></i>
//               </Link>
//               <Link to={{ pathname: 'https://www.youtube.com/@dinhluongta' }} target="_blank">
//                 <i className="fab fa-youtube youtube"></i>
//               </Link>
//               <Link to={{ pathname: 'https://www.tiktok.com/@dluongta_' }} target="_blank">
//                 <i className="fab fa-tiktok tiktok"></i>
//               </Link>
//               <Link to={{ pathname: 'https://github.com/dluongta' }} target="_blank">
//                 <i className="fab fa-github github"></i>
//               </Link>
//             </div>

//             <p>
//               I am Dinh Luong Ta. I am a programmer skilled at Web Development,
//               Android Development. I am also learning Artificial Intelligence and Hardware.
//               I am extremely fascinated by science, engineering and technology. All of my products are TSCEND generation made by DLUONGTA.
//             </p>

//             <p>
//               My Resume:
//               <Link to={{ pathname: '/resume.pdf' }} target="_blank" className="blue">
//                 Resume Viewer Page
//               </Link>
//             </p>

//             <div className="btn-pulse-wrapper">
//               <span className="pulse-third"></span>
//               <button className="primary-btn btn-led">
//                 Contact Me
//                 <span></span>
//                 <span></span>
//                 <span></span>
//                 <span></span>
//                 <span className="line2"></span>
//                 <span className="line2"></span>
//                 <span className="line2"></span>
//                 <span className="line2"></span>
//               </button>
//             </div>

//           </div>
//         </div>
//       </section>
//     </>
//   );
// };
// import React from 'react';
// import { Link } from 'react-router-dom';
// import RotatingText from './RotatingText'; // Đảm bảo đường dẫn này đúng
// import headerImg from '../../../../assets/main.png';
// import './RotatingText.css';
// import './Home.css';

// export const Home = ({ className }) => {
//   const textToRotate = [
//     "Proficient Programmer", 
//     "Software Developer", 
//     "Hardware Engineer"
//   ];

//   return (
//     <section className={`home ${className}`}>
//       <div className="container home-flex-container">

//         {/* BÊN TRÁI: Ảnh */}
//         <div className="home-left">
//           <div className="img-wrapper">
//             <img src={headerImg} alt="Header" />
//           </div>
//         </div>

//         {/* BÊN PHẢI: Nội dung căn giữa */}
//         <div className="home-right">
//           <div className="content-inner">

//             <div className="headline" style={{ width: '100%', textAlign: 'center' }}>
//               <h1 className="gradientTextStyle" style={{ marginBottom: '10px' }}>I AM A</h1>
//               <h1 style={{ display: 'block', width: '100%' }}>
//                 <RotatingText
//                   texts={textToRotate}
//                   mainClassName="rotating-text-highlight"
//                   staggerFrom="last"
//                   staggerDuration={0.025}
//                   rotationInterval={3000}
//                   splitBy="characters" 
//                 />
//               </h1>
//             </div>

//             <div className="socialIcon">
//               <Link to="https://www.facebook.com/dluongta" target="_blank">
//                 <i className="fab fa-facebook-f facebook"></i>
//               </Link>
//               <Link to="https://www.instagram.com/dluongta/" target="_blank">
//                 <i className="fab fa-instagram instagram"></i>
//               </Link>
//               <Link to="https://www.linkedin.com/in/dinh-luong-ta-940ba2286/" target="_blank">
//                 <i className="fab fa-linkedin likedin"></i>
//               </Link>
//               <Link to="https://www.youtube.com/@dinhluongta" target="_blank">
//                 <i className="fab fa-youtube youtube"></i>
//               </Link>
//               <Link to="https://www.tiktok.com/@dluongta_" target="_blank">
//                 <i className="fab fa-tiktok tiktok"></i>
//               </Link>
//               <Link to="https://github.com/dluongta" target="_blank">
//                 <i className="fab fa-github github"></i>
//               </Link>
//             </div>

//             <div className="description-text">
//               <p>
//                 I am Dinh Luong Ta. I am a programmer skilled at Web Development,
//                 Android Development. I am also learning Artificial Intelligence and Hardware.
//                 I am extremely fascinated by science and technology. All of my products are TSCEND generation made by DLUONGTA.
//               </p>

//               <p>
//                 My Resume:
//                 <Link to="/resume.pdf" target="_blank" className="blue-link">
//                   {" "}Resume Viewer Page
//                 </Link>
//               </p>
//             </div>

//             <div className="btn-pulse-wrapper">
//               <span className="pulse-third"></span>
//               <button className="primary-btn btn-led">
//                 Contact Me
//                 <span></span><span></span><span></span><span></span>
//                 <span className="line2"></span><span className="line2"></span>
//                 <span className="line2"></span><span className="line2"></span>
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// import React from 'react';
// import { Link } from 'react-router-dom';
// import RotatingText from './RotatingText';
// import mainImage from '../../../../assets/main.png';
// import './RotatingText.css';
// import './Home.css';

// export const Home = ({ className }) => {
//   const textToRotate = [
//     "Proficient Programmer",
//     "Software Developer",
//     "Hardware Engineer"
//   ];

//   return (
//     <section className={`home-left ${className}`}>
//       <div className="container flex">
//         <div className="left">
//           <div className="img">
//             <img src={mainImage} alt="" />
//           </div>
//         </div>

//         <div className="home-right">
//           <div className="content-inner">

//             <div className="headline" style={{ width: '100%', textAlign: 'center' }}>
//               <h1 className="gradientTextStyle" style={{ marginBottom: '10px' }}>I AM A</h1>
//               {/* Thêm overflow: 'hidden' và padding để chữ bị cắt mượt mà khi trượt lên, không bị tràn hay nhấp nháy */}
//               <h1 className="rotatingTextStyle" style={{ display: 'block', width: '100%', overflow: 'hidden', padding: '10px 0' }}>
//                 <RotatingText
//                   texts={textToRotate}
//                   mainClassName="rotating-text-highlight"
//                   staggerFrom="last"
//                   staggerDuration={0.025}
//                   rotationInterval={3000}
//                   splitBy="characters"
//                 />
//               </h1>
//             </div>

//             <div className="socialIcon">
//               <a href="https://www.facebook.com/dluongta" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-facebook-f facebook"></i>
//               </a>
//               <a href="https://www.instagram.com/dluongta/" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-instagram instagram"></i>
//               </a>
//               <a href="https://www.linkedin.com/in/dinh-luong-ta-940ba2286/" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-linkedin likedin"></i>
//               </a>
//               <a href="https://www.youtube.com/@dinhluongta" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-youtube youtube"></i>
//               </a>
//               <a href="https://www.tiktok.com/@dluongta_" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-tiktok tiktok"></i>
//               </a>
//               <a href="https://github.com/dluongta" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-github github"></i>
//               </a>
//             </div>

//             <div className="description-text">
//               <p>
//                 I am Dinh Luong Ta. I am a programmer skilled in Software Development, including Web, Android and Application Development. I am also learning about Artificial Intelligence and Hardware.
//                 I am extremely fascinated by science, engineering and technology. All of my products are from the TSCEND generation, made by DLUONGTA.
//               </p>

//               <p>
//                 My Resume:
//                 <Link to="/dluongta_resume.pdf" target="_blank" className="blue-link">
//                   Resume Viewer Page
//                 </Link>
//               </p>
//             </div>

//             <button className="primary-btn btn-led">
//               Contact Me
//               <span></span><span></span><span></span><span></span>
//               <span className="line2"></span><span className="line2"></span>
//               <span className="line2"></span><span className="line2"></span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// import React from 'react';
// import { Link } from 'react-router-dom';
// import RotatingText from './RotatingText';
// import mainImage from '../../../../assets/main.png';
// import './RotatingText.css';
// import './Home.css';

// export const Home = ({ className }) => {
//   const textToRotate = [
//     "thinking",
//     "coding",
//     "components"
//   ];

//   return (
//     <section className={`home-left ${className}`}>
//       <div className="container flex">
//         <div className="left">
//           <div className="img">
//             <img src={mainImage} alt="Dinh Luong Ta Main" />
//           </div>
//         </div>

//         <div className="home-right">
//           <div className="content-inner">

//             <div 
//               className="headline" 
//               style={{ 
//                 width: '100%', 
//                 display: 'flex', 
//                 flexDirection: 'row', 
//                 justifyContent: 'center', 
//                 alignItems: 'center', 
//                 gap: '15px',              
//                 flexWrap: 'nowrap' 
//               }}
//             >
//               <h1 
//                 className="gradientTextStyle" 
//                 style={{ 
//                   margin: '0', 
//                   whiteSpace: 'nowrap',
//                   width: 'auto' ,
//                   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
//                 }}
//               >
//                 DINHLUONGTA
//               </h1>

//             </div>

//             <div className="socialIcon">
//               <a href="https://www.facebook.com/dluongta" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-facebook-f facebook"></i>
//               </a>
//               <a href="https://www.instagram.com/dluongta/" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-instagram instagram"></i>
//               </a>
//               <a href="https://www.linkedin.com/in/dinh-luong-ta-940ba2286/" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-linkedin likedin"></i>
//               </a>
//               <a href="https://www.youtube.com/@dinhluongta" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-youtube youtube"></i>
//               </a>
//               <a href="https://www.tiktok.com/@dluongta_" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-tiktok tiktok"></i>
//               </a>
//               <a href="https://github.com/dluongta" target="_blank" rel="noopener noreferrer">
//                 <i className="fab fa-github github"></i>
//               </a>
//             </div>

//             <div className="description-text">
//               <p>
//                 I am Dinh Luong Ta. I am a programmer skilled in Software Development, including Web, Android and Application Development. I am also learning about Artificial Intelligence and Hardware.
//                 I am extremely fascinated by science, engineering and technology. All of my products are from the TSCEND generation, made by DLUONGTA.
//               </p>

//               <p>
//                 My Resume:
//                 <Link to="/dluongta_resume.pdf" target="_blank" className="blue-link">
//                   {" "}Resume Viewer Page
//                 </Link>
//               </p>
//             </div>

//             <button className="primary-btn btn-led">
//               Contact Me
//               <span></span><span></span><span></span><span></span>
//               <span className="line2"></span><span className="line2"></span>
//               <span className="line2"></span><span className="line2"></span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RotatingText from './RotatingText';
import mainImage from '../../../../assets/main.png';
import './RotatingText.css';
import './Home.css';

export const Home = ({ className }) => {
  const originalToRotate = [
    "Skilled Programmer",
    "Software Developer",
    "Hardware Engineer"
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

            {/* Khối I AM A đã được chỉnh font-size, font-weight và thêm màu Gradient */}
            <div style={{ width: '100%', textAlign: 'center', marginBottom: '5px' }}>
              <h1 
                style={{ 
                  margin: '0', 
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  // Sử dụng clamp() để kích thước tự động co giãn giống hệt file CSS của chữ chạy
                  // fontSize: isMobile ? 'clamp(2.5rem, 6.2vw, 2.6rem)' : 'clamp(1.5rem, 5vw, 3.5rem)',
                  fontSize: isMobile ? 'clamp(2.4rem, 6vw, 2.5rem)' : 'clamp(1.5rem, 5vw, 3.5rem)',
                  fontWeight: isMobile ? 900 : 800,
                  lineHeight: '1.2',
                  // Mã màu gradient: cam, đỏ, hồng, tím, xanh
                  // background: 'linear-gradient(94deg,#fe954a 6.06%,#f84063 34.53%,#ad29e3 66.74%,#008eff 100.96%)',
                  background: 'linear-gradient(94deg, #ff0000 0%, #fe4400 40%, #ff2158 60%, #ff003c 100%)', 
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block'
                }}
              >
                I AM A
              </h1>
            </div>

            {/* Khối chữ chạy giữ nguyên */}
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
                  width: 'auto' ,
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
                I am Dinh Luong Ta. I am a programmer skilled in Software Development, including Web, Android and Application Development. I am also learning about Artificial Intelligence and Hardware.
                I am extremely fascinated by science, engineering and technology. All of my products are from the TSCEND generation, made by DLUONGTA. As technology continues to evolve at an unprecedented speed, I want to study, innovate and contribute to solutions that create a significant, beneficial and huge impact on the world.
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