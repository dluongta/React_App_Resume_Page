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
//               I am extremely fascinated by science, engineering and technology. All of my products are ULTRAMIND generation made by DLUONGTA.
//             </p>

//             <p>
//               My Resume:
//               <Link to={{ pathname: '/Resume.pdf' }} target="_blank" className="blue">
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
//                 I am extremely fascinated by science and technology. All of my products are ULTRAMIND generation made by DLUONGTA.
//               </p>

//               <p>
//                 My Resume:
//                 <Link to="/Resume.pdf" target="_blank" className="blue-link">
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
import React from 'react';
import { Link } from 'react-router-dom';
import RotatingText from './RotatingText';
import mainImage from '../../../../assets/main.png';
import './RotatingText.css';
import './Home.css';

export const Home = ({ className }) => {
  const textToRotate = [
    "Proficient Programmer",
    "Software Developer",
    "Hardware Engineer"
  ];

  return (
    <section className={`home-left ${className}`}>
      <div className="container flex">
        <div className="left">
          <div className="img">
            <img src={mainImage} alt="" />
          </div>
        </div>

        <div className="home-right">
          <div className="content-inner">

            <div className="headline" style={{ width: '100%', textAlign: 'center' }}>
              <h1 className="gradientTextStyle" style={{ marginBottom: '10px' }}>I AM A</h1>
              <h1 className="rotatingTextStyle" style={{ display: 'block', width: '100%' }}>
                <RotatingText
                  texts={textToRotate}
                  mainClassName="rotating-text-highlight"
                  staggerFrom="last"
                  staggerDuration={0.025}
                  rotationInterval={3000}
                  splitBy="characters"
                />
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
                I am Dinh Luong Ta. I am a programmer skilled at Software Development like Web, Android, Computer System And Application Development. I am also learning about Artificial Intelligence and Hardware.
                I am extremely fascinated by science, engineering and technology. All of my products are from the ULTRAMIND generation, made by DLUONGTA.
              </p>

              <p>
                My Resume:
                <Link to="/Resume.pdf" target="_blank" className="blue-link">
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