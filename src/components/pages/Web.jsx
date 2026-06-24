import React from 'react';
import { Link } from 'react-router-dom';
import PixelCard from './PixelCard'; // Đừng quên import component này

export const Web = () => {
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
      link: "https://github.com/luen2003/python-code",
      linkName: "Python Code",
    },
    {
      id: "05",
      link: "https://vietnam-map-platform.vercel.app/",
      linkName: "Vietnam Map Platform",
    },
    {
      id: "06",
      link: "https://dluongta.github.io/qr-scanner.html",
      linkName: "QRCode Scanner",
    },
    {
      id: "07",
      link: "https://react-app-videocall.onrender.com/",
      linkName: "Voice Or Video Call Using WebRTC",
    },
    {
      id: "08",
      link: "https://dluongta.github.io/qr-generator.html",
      linkName: "QRCode Generator",
    },
    {
      id: "09",
      link: "https://react-app-google-login-page.vercel.app/",
      linkName: "React App Google Login Page",
    },
    {
      id: "10",
      link: "https://dluongta.github.io/pdf-excel-generator.html",
      linkName: "PDF And Excel Generator",
    },
    {
      id: "11",
      link: "https://react-livestream-app.onrender.com/",
      linkName: "Livestream App",
    },
    {
      id: "12",
      link: "https://dluongta.github.io/text_speech.html",
      linkName: "Text Speech",
    },
    {
      id: "13",
      link: "https://dluongta.github.io/quiz-app.html",
      linkName: "Quizzes App",
    },
    {
      id: "14",
      link: "https://dluongta.github.io/digital-calendar.html",
      linkName: "Digital Calendar",
    },
    {
      id: "15",
      link: "https://dluongta.github.io/caculator.html",
      linkName: "Caculator",
    },
    {
      id: "16",
      link: "https://github.com/luen2003/ASPNET_API",
      linkName: "ASPNET API",
    },
    {
      id: "17",
      link: "https://deeptankio.onrender.com/",
      linkName: "DeepTankIO",
    },
    {
      id: "18",
      link: "https://dluongta.github.io/image_editor/index.html",
      linkName: "Image Editor",
    },
    {
      id: "19",
      link: "https://dluongta.github.io/upload_avatar.html",
      linkName: "Upload Avatar",
    },
    {
      id: "20",
      link: "https://react-app-bank-code.vercel.app/",
      linkName: "Confirm Payment",
    },
    {
      id: "21",
      link: "https://github.com/luen2003/mysql-api",
      linkName: "MySQL API",
    },
    {
      id: "22",
      link: "https://github.com/luen2003/php-mysql-api",
      linkName: "PHP MySQL API",
    },
    {
      id: "23",
      link: "https://dluongta.github.io/flipbook3d.html",
      linkName: "3D Flip Book",
    },
    {
      id: "24",
      link: "https://dluongta.github.io/text_image.html",
      linkName: "Text Image",
    },
    {
      id: "25",
      link: "https://dluongta.github.io/math_editor.html",
      linkName: "Math Editor",
    },
    {
      id: "26",
      link: "https://github.com/luen2003/enhance_image_quality",
      linkName: "Enhance Image Quality",
    },
    {
      id: "27",
      link: "https://dluongta.github.io/voice_recording.html",
      linkName: "Voice Recording",
    },
    {
      id: "28",
      link: "https://dluongta.github.io/video_recording.html",
      linkName: "Video Recording",
    },
    {
      id: "29",
      link: "https://dluongta.github.io/spin_wheel.html",
      linkName: "Spin Wheel",
    },
    {
      id: "30",
      link: "https://dluongta.github.io/vn-input.html",
      linkName: "VN Input",
    },
    {
      id: "31",
      link: "https://dluongta.github.io/flip_number.html",
      linkName: "Flip Number",
    }
  ];

  return (
    <>
      <section className='pages'>
        <div className="cards-wrapper">
          {data.map((value) => {
            return (
              <PixelCard key={value.id} variant="pink" className='card'>
                
                {/* Bọc nội dung bằng position: absolute và z-index để không bị che bởi hiệu ứng canvas */}
                <div className="card-content" style={{ position: 'absolute', zIndex: 10, top: 0, left: 0, width: '100%' }}>
                  <h1>{value.linkName}</h1>
                </div>
                
                <Link 
                  className='link' 
                  to={{ pathname: value.link }} 
                  target="_blank"
                  style={{ position: 'absolute', zIndex: 10 }} // Nổi Link lên trên
                >
                  &rarr; {value.link}
                </Link>

              </PixelCard>
            );
          })}
        </div>
      </section>
    </>
  );
};