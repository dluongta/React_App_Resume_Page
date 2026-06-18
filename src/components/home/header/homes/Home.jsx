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
import mainImage from '../../../../assets/main.png';
// Đảm bảo các file CSS này tồn tại ở đúng đường dẫn
import './RotatingText.css'; 
import './Home.css';

export const Home = ({ className }) => {
  // Danh sách các kỹ năng để xoay vòng
  const originalToRotate = [
    "Skilled Programmer",
    "Software Developer",
    "Hardware Engineer"
  ];
  
  // State để xử lý logic carousel (thêm phần tử đầu vào cuối để tạo loop vô tận mượt mà)
  const [toRotate, setToRotate] = useState([...originalToRotate, originalToRotate[0]]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Xử lý kiểm tra kích thước màn hình để responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logic tự động chạy Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      // Nếu đang ở phần tử cuối cùng (bản sao của phần tử đầu)
      if (currentLineIndex === toRotate.length - 1) {
        // Tắt animation chuyển cảnh
        setIsTransitioning(false);
        // Nhảy ngay lập tức về phần tử đầu tiên thực sự
        setCurrentLineIndex(0);

        // Đợi một chút xíu (20ms) để DOM cập nhật xong việc nhảy index
        setTimeout(() => {
          // Bật lại animation và chuyển sang phần tử thứ 2
          setIsTransitioning(true);
          setCurrentLineIndex(1);
        }, 20);
      } else {
        // Chuyển sang phần tử tiếp theo bình thường
        setIsTransitioning(true);
        setCurrentLineIndex((prevIndex) => prevIndex + 1);
      }
    }, 3000); // Thời gian chuyển đổi (3 giây)

    return () => clearInterval(interval);
  }, [currentLineIndex, toRotate.length]);

  return (
    <section className={`home-left ${className || ''}`}>
      <div className="container flex">
        {/* BÊN TRÁI: Khu vực chứa ảnh */}
        <div className="left">
          <div className="img">
            <img src={mainImage} alt="Dinh Luong Ta Main" />
          </div>
        </div>

        {/* BÊN PHẢI: Khu vực chứa nội dung text */}
        <div className="home-right">
          <div className="content-inner">

            {/* --- KHU VỰC TIÊU ĐỀ (Headline) ĐÃ FIX --- */}
            <div 
              className="headline" 
              style={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', /* Xếp dọc: I AM A ở trên, chữ chạy ở dưới */
                justifyContent: 'center', 
                alignItems: 'center', /* Căn giữa theo chiều ngang */
                gap: '10px', /* Khoảng cách giữa dòng trên và dòng dưới */
                marginBottom: isMobile ? '15px' : '20px' /* Khoảng cách với khu vực social icon */
              }}
            >
              {/* Dòng 1: I AM A cố định với dải màu Gradient tùy chỉnh */}
              <h1 
                style={{ 
                  margin: '0', 
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontWeight: 'bold',
                  fontSize: isMobile ? '24px' : '36px', /* Responsive font size */
                  // Dải màu: Cam - Đỏ - Hồng - Tím - Xanh dương
                  background: 'linear-gradient(to right, #FF8C00, #FF0000, #FF69B4, #800080, #0000FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                  textTransform: 'uppercase', /* Viết hoa toàn bộ */
                  lineHeight: '1.2'
                }}
              >
                I AM A
              </h1>

              {/* Dòng 2: Carousel chữ chạy kỹ năng */}
              <h1 
                style={{ 
                  margin: '0', 
                  whiteSpace: 'nowrap',
                  width: 'auto' ,
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                className="gradientTextStyleFlexible"
              >
                {/* Container bọc ngoài carousel (thường có overflow: hidden trong CSS) */}
                <div className="carousel_carousel_container">
                  <div
                    className="carousel_carousel"
                    style={{
                      // Di chuyển container theo chiều dọc dựa trên index hiện tại
                      // Giả sử mỗi item chiếm 25% chiều cao tổng của container carousel (vì có 4 items: 3 thật + 1 copy)
                      transform: `translateY(calc(-${currentLineIndex * 25}%))`,
                      // Hiệu ứng mượt mà khi chuyển cảnh, tắt khi loop về đầu
                      transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                    }}
                  >
                    {toRotate.map((text, index) => (
                      <div
                        key={index}
                        // Style gradient cho chữ chạy này thường được định nghĩa trong file CSS .gradientTextStyle
                        className="carousel_carousel_item gradientTextStyle"
                        style={{
                          fontSize: isMobile ? '22px' : '34px', /* Responsive font size cho chữ chạy */
                          textAlign: 'center'
                        }}
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </h1>
            </div>
            {/* --- HẾT KHU VỰC TIÊU ĐỀ --- */}

            {/* Khu vực các Icon mạng xã hội */}
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

            {/* Khu vực text giới thiệu bản thân */}
            <div className="description-text">
              <p>
                I am Dinh Luong Ta. I am a programmer skilled in Software Development, including Web, Android and Application Development. I am also learning about Artificial Intelligence and Hardware.
                I am extremely fascinated by science, engineering and technology. All of my products are from the TSCEND generation, made by DLUONGTA. As technology continues to evolve at an unprecedented speed, I want to study, innovate and contribute to solutions that create a significant, beneficial and huge impact on the world.
              </p>

              <p>
                My Resume:
                <Link to="/dluongta_resume.pdf" target="_blank" className="blue-link">
                  &nbsp;Resume Viewer Page
                </Link>
              </p>
            </div>

            {/* Nút Contact Me */}
            <button className="primary-btn btn-led">
              Contact Me
              {/* Các thẻ span bổ trợ hiệu ứng led/pulse nếu có trong CSS */}
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