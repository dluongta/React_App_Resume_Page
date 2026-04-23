import React from 'react'
import { Link } from 'react-router-dom'


export const Pages = () => {
  const data = [
    {
      id: "01",
      link: "https://dluongta.github.io/",
      linkName: "General Intoduce Page",
    },
    {
      id: "02",
      link: "https://note-task.onrender.com",
      linkName: "Note Task Website",
    },
    {
      id: "03",
      link: "https://the-digital-shop.onrender.com",
      linkName: "The Shop Website",
    },
    {
      id: "04",
      link: "https://mgpost.onrender.com",
      linkName: "Post office website with live chat",
    },
    {
      id: "05",
      link: "https://github.com/luen2003/python-code",
      linkName: "Python Code",
    },
    {
      id: "06",
      link: "https://vietnam-map-platform.vercel.app/",
      linkName: "Vietnam Map Platform",
    },
    {
      id: "07",
      link: "https://qr-scanner-live.netlify.app/",
      linkName: "QR Code Scanner",
    },
    {
      id: "08",
      link: "https://react-app-videocall.onrender.com/",
      linkName: "Voice Or Video Call Using WebRTC",
    },
    {
      id: "09",
      link: "https://react-qr-code-generator-live.vercel.app/",
      linkName: "React QRCode Generator",
    },
    {
      id: "10",
      link: "https://react-app-google-login-page.vercel.app/",
      linkName: "React App Google Login Page",
    },
    {
      id: "11",
      link: "https://dluongta.github.io/pdf-excel-generator.html",
      linkName: "PDF And Excel Generator",
    },
    {
      id: "12",
      link: "https://react-livestream-app.onrender.com/",
      linkName: "Livestream App",
    },
    {
      id: "13",
      link: "https://github.com/luen2003/Face-App",
      linkName: "Face Recognition Analysis",
    },
    {
      id: "14",
      link: "https://dluongta.github.io/text_speech.html",
      linkName: "Text Speech",
    },
    {
      id: "15",
      link: "https://dluongta.github.io/quiz-app.html",
      linkName: "Quizzes App",
    },
    {
      id: "16",
      link: "https://dluongta.github.io/digital-calendar.html",
      linkName: "Digital Calendar",
    },
    {
      id: "17",
      link: "https://dluongta.github.io/caculator.html",
      linkName: "Caculator",
    },
    {
      id: "18",
      link: "https://github.com/luen2003/ASPNET_API",
      linkName: "ASPNET API",
    },
    {
      id: "19",
      link: "https://deeptankio.onrender.com/",
      linkName: "DeepTankIO",
    },
    {
      id: "20",
      link: "https://dluongta.github.io/image_editor/index.html",
      linkName: "Image Editor",
    },
    {
      id: "21",
      link: "https://dluongta.github.io/upload_avatar.html",
      linkName: "Upload Avatar",
    },
    {
      id: "22",
      link: "https://react-app-bank-code.vercel.app/",
      linkName: "Confirm Payment",
    },
    {
      id: "23",
      link: "https://github.com/luen2003/mysql-api",
      linkName: "MySQL API",
    },
    {
      id: "24",
      link: "https://github.com/luen2003/php-mysql-api",
      linkName: "PHP MySQL API",
    },
    {
      id: "25",
      link: "https://dluongta.github.io/flipbook3d.html",
      linkName: "3D PDF Flipbook",
    },
    {
      id: "26",
      link: "https://dluongta.github.io/text_image.html",
      linkName: "Text Image",
    },
    {
      id: "27",
      link: "https://dluongta.github.io/math_editor.html",
      linkName: "Math Editor",
    },
    {
      id: "28",
      link: "https://github.com/luen2003/enhance_image_quality",
      linkName: "Enhance Image Quality",
    }
  ];
  return (
    <>
      <section className='pages'>
        {/* <div id="mySidenav" class="sidenav">
          <Link to='/pages' id="pages"> Pages </Link>
          <Link to='/blog' id="blog"> Blog </Link>
          <Link to='/portfolio' id="portfolio"> Portfolio </Link>
          <Link to='/contact' id="contact"> Contact </Link>
          <Link to='/galaxy' id="galaxy"> Galaxy </Link>
        </div> */}
        <div className="cards-wrapper">

          {data.map((value) => {
            return (<div className='card '>
              <div className="card-content">
                <h1>{value.linkName}</h1>
              </div>
              <Link className='link' to={{ pathname: value.link }} target="_blank">&rarr; {value.link}</Link>
            </div>)
          }
          )}
        </div>
      </section>
    </>
  )
}
