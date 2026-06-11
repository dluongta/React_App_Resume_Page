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
      link: "https://github.com/luen2003/NoteApp/releases/download/v1.0.0/app-release.apk",
      linkName: "Note App",
    },
    {
      id: "03",
      link: "https://github.com/luen2003/SDLGAME/archive/refs/tags/1.0.zip",
      linkName: "SDL Game - Water Pipe ",
    },
    {
      id: "04",
      link: "https://the-digital-shop.onrender.com",
      linkName: "The Shop Website",
    },
    {
      id: "05",
      link: "https://github.com/luen2003/NewsApp/releases/download/v1.0.0/app-release.apk",
      linkName: "News App",
    },
    {
      id: "06",
      link: "https://mgpost.onrender.com",
      linkName: "Post office website with live chat",
    },
    {
      id: "07",
      link: "https://github.com/luen2003/python-code",
      linkName: "Python Code",
    },
    {
      id: "08",
      link: "https://vietnam-map-platform.vercel.app/",
      linkName: "Vietnam Map Platform",
    },
    {
      id: "09",
      link: "https://dluongta.github.io/qr-scanner.html",
      linkName: "QRCode Scanner",
    },
    {
      id: "10",
      link: "https://react-app-videocall.onrender.com/",
      linkName: "Voice Or Video Call Using WebRTC",
    },
    {
      id: "11",
      link: "https://dluongta.github.io/qr-generator.html",
      linkName: "QRCode Generator",
    },
    {
      id: "12",
      link: "https://react-app-google-login-page.vercel.app/",
      linkName: "React App Google Login Page",
    },
    {
      id: "13",
      link: "https://dluongta.github.io/pdf-excel-generator.html",
      linkName: "PDF And Excel Generator",
    },
    {
      id: "14",
      link: "https://react-livestream-app.onrender.com/",
      linkName: "Livestream App",
    },
    {
      id: "15",
      link: "https://dluongta.github.io/text_speech.html",
      linkName: "Text Speech",
    },
    {
      id: "16",
      link: "https://dluongta.github.io/quiz-app.html",
      linkName: "Quizzes App",
    },
    {
      id: "17",
      link: "https://dluongta.github.io/digital-calendar.html",
      linkName: "Digital Calendar",
    },
    {
      id: "18",
      link: "https://dluongta.github.io/caculator.html",
      linkName: "Caculator",
    },
    {
      id: "19",
      link: "https://github.com/luen2003/ASPNET_API",
      linkName: "ASPNET API",
    },
    {
      id: "20",
      link: "https://deeptankio.onrender.com/",
      linkName: "DeepTankIO",
    },
    {
      id: "21",
      link: "https://dluongta.github.io/image_editor/index.html",
      linkName: "Image Editor",
    },
    {
      id: "22",
      link: "https://dluongta.github.io/upload_avatar.html",
      linkName: "Upload Avatar",
    },
    {
      id: "23",
      link: "https://react-app-bank-code.vercel.app/",
      linkName: "Confirm Payment",
    },
    {
      id: "24",
      link: "https://github.com/luen2003/mysql-api",
      linkName: "MySQL API",
    },
    {
      id: "25",
      link: "https://github.com/luen2003/php-mysql-api",
      linkName: "PHP MySQL API",
    },
    {
      id: "26",
      link: "https://github.com/luen2003/Fingerprint/releases/download/v1.0.0/app-release.apk",
      linkName: "Fingerprint",
    },
    {
      id: "27",
      link: "https://dluongta.github.io/flipbook3d.html",
      linkName: "3D Flip Book",
    },
    {
      id: "28",
      link: "https://dluongta.github.io/text_image.html",
      linkName: "Text Image",
    },
    {
      id: "29",
      link: "https://dluongta.github.io/math_editor.html",
      linkName: "Math Editor",
    },
    {
      id: "30",
      link: "https://github.com/luen2003/enhance_image_quality",
      linkName: "Enhance Image Quality",
    },
    {
      id: "31",
      link: "https://dluongta.github.io/voice_recording.html",
      linkName: "Voice Recording",
    },
    {
      id: "32",
      link: "https://dluongta.github.io/video_recording.html",
      linkName: "Video Recording",
    },
    {
      id: "33",
      link: "https://dluongta.github.io/spin_wheel.html",
      linkName: "Spin Wheel",
    },
    {
      id: "34",
      link: "https://github.com/luen2003/WeatherApp/releases/download/v1.0.0/app-release.apk",
      linkName: "Weather App",
    }
  ];
  return (
    <>
      <section className="portfolio">
        {/* <div id="mySidenav" className="sidenav">
        <Link to='/pages' id="pages"> Pages </Link>
        <Link to='/blog' id="blog"> Blog </Link>
        <Link to='/portfolio' id="portfolio"> Portfolio </Link>
        <Link to='/contact' id="contact"> Contact </Link>
        <Link to='/galaxy' id="galaxy"> Galaxy </Link>
      </div> */}
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
