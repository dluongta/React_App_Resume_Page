import React from "react";
import { Link } from "react-router-dom";

export const Portfolio = () => {
  const data = [
    {
      id: "01",
      link: "https://dluongta.github.io/",
      linkName: "General Intoduce Page",
    },
    {
      id: "02",
      link: "http://carttechnology.atwebpages.com",
      linkName: "Shopping Cart And Comment",
    },
    {
      id: "03",
      link: "https://github.com/luen2003/NoteApp/releases/download/v1.0.0/app-release.apk",
      linkName: "Note App",
    },
    {
      id: "04",
      link: "https://github.com/luen2003/ChatApp/releases/download/v1.0.0/app-release.apk",
      linkName: "Chat App",
    },
    {
      id: "05",
      link: "https://github.com/luen2003/SDLGAME/archive/refs/tags/1.0.zip",
      linkName: "SDL Game - Water Pipe ",
    },
    {
      id: "06",
      link: "https://the-digital-shop.onrender.com",
      linkName: "The Shop Website",
    },
    {
      id: "07",
      link: "https://github.com/luen2003/NewsApp/releases/download/v1.0.0/app-release.apk",
      linkName: "News App",
    },
    {
      id: "08",
      link: "https://mgpost.onrender.com",
      linkName: "Post office website with live chat",
    },
    {
      id: "09",
      link: "https://github.com/luen2003/python-code",
      linkName: "Python Code",
    },
    {
      id: "10",
      link: "https://vietnam-map-platform.vercel.app/",
      linkName: "Vietnam Map Platform",
    },
    {
      id: "11",
      link: "https://qr-scanner-live.netlify.app/",
      linkName: "QR Code Scanner",
    },
    {
      id: "12",
      link: "https://react-app-videocall.onrender.com/",
      linkName: "Voice Or Video Call Using WebRTC",
    },
    {
      id: "13",
      link: "https://react-qr-code-generator-live.vercel.app/",
      linkName: "React QRCode Generator",
    },
    {
      id: "14",
      link: "https://react-app-google-login-page.vercel.app/",
      linkName: "React App Google Login Page",
    },
    {
      id: "15",
      link: "http://pdf-excel-generator.atwebpages.com/",
      linkName: "PDF And Excel Generator",
    },
    {
      id: "16",
      link: "https://github.com/luen2003/Flutter_Weather_App/releases/download/v1.0.0/app-release.apk",
      linkName: "Flutter Weather App",
    },
    {
      id: "17",
      link: "https://tiktok-short-video.vercel.app/",
      linkName: "TikTok Short Video",
    },
    {
      id: "18",
      link: "https://react-livestream-app.onrender.com/",
      linkName: "Livestream App",
    },
    {
      id: "19",
      link: "https://bank-qrcode.w3spaces.com/",
      linkName: "Bank QRCode",
    },
    {
      id: "20",
      link: "https://github.com/luen2003/Face-App",
      linkName: "Face Recognition Analysis",
    },
    {
      id: "21",
      link: "https://dluongta.github.io/text_speech.html",
      linkName: "Text Speech",
    },
    {
      id: "22",
      link: "https://github.com/luen2003/Styled_Python",
      linkName: "Styled Effect Python App",
    },
    {
      id: "23",
      link: "https://dluongta.github.io/quiz-app.html",
      linkName: "Quizzes App",
    },
    {
      id: "24",
      link: "https://dluongta.github.io/digital-calendar.html",
      linkName: "Digital Calendar",
    },
    {
      id: "25",
      link: "https://dluongta.github.io/caculator.html",
      linkName: "Digital Caculator",
    },
    {
      id: "26",
      link: "https://github.com/luen2003/ASPNET_API",
      linkName: "ASPNET API",
    },
    {
      id: "27",
      link: "https://github.com/luen2003/text-3d-video",
      linkName: "Text 3D Video",
    },
    {
      id: "28",
      link: "https://run-code-online.w3spaces.com/",
      linkName: "Run Code Online",
    },
    {
      id: "29",
      link: "https://deeptankio.onrender.com/",
      linkName: "DeepTankIO",
    },
    {
      id: "30",
      link: "https://dluongta.github.io/image_editor/index.html",
      linkName: "Image Editor",
    },
    {
      id: "31",
      link: "https://dluongta.github.io/particles_hand_control.html",
      linkName: "Particle Hand Control",
    },
    {
      id: "32",
      link: "https://dluongta.github.io/galaxy_love.html",
      linkName: "Galaxy Love",
    },
    {
      id: "33",
      link: "https://dluongta.github.io/upload_avatar.html",
      linkName: "Upload Avatar",
    },
    {
      id: "34",
      link: "https://react-app-bank-code.vercel.app/",
      linkName: "Confirm Payment",
    },
    {
      id: "35",
      link: "https://github.com/luen2003/mysql-api",
      linkName: "MySQL API",
    },
    {
      id: "36",
      link: "https://github.com/luen2003/php-mysql-api",
      linkName: "PHP MySQL API",
    }
  ];
  return (
    <>
      <section className="portfolio">
        <div id="mySidenav" class="sidenav">
          <Link to="/pages" id="pages">
            Pages
          </Link>
          <Link to="/blog" id="blog">
            Blog
          </Link>
          <Link to="/portfolio" id="portfolio">
            Portfolio
          </Link>
          <Link to="/contact" id="contact">
            Contact
          </Link>
        </div>
        <div className="cards-wrapper">

          <div className="card ">
            <div className="card-content">
              <h1>Major: Information Of Technology - UET - VNU</h1>
              <h1>Time: 2021 - 2025</h1>
            </div>
          </div>

          {data.map((value) => {
            return (
              <div className="card ">
                <div className="card-content">
                  <h1>{value.linkName}</h1>
                </div>
                <Link
                  className="link"
                  to={{ pathname: value.link }}
                  target="_blank"
                >
                  &rarr; {value.link}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
