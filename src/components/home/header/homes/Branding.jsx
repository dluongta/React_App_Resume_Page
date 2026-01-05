import React from 'react';
import logo from '../../../../assets/luen-1.jpg';

import GalaxyAnimation from './GalaxyAnimation';
import lumindLogo from '../../../../assets/luen-1.jpg';
import Hero from './Hero';
import CustomVideoPlayer from './CustomVideoPlayer';
import caption from '../../../../assets/caption.vtt';
import bgVideo from '../../../../assets/dluongta_animation.mp4';
import caption_logo from '../../../../assets/caption_logo.vtt';
import bgLogoVideo from '../../../../assets/lumind_logo.mp4';
import lumind_animation_text from '../../../../assets/lumind_animation.vtt';
import lumindAnimationVideo from '../../../../assets/lumind_animation.mp4';
import ParticleTextCanvas from "./ParticleTextCanvas";

import hexagonImg from '../../../../assets/hexagon-main.png'; // Ví dụ, hãy đảm bảo bạn có file này hoặc dùng file khác

export const Branding = ({ className }) => {
  const data = [
    {
      id: "01",
      heading: "Digital Branding",
      desc: "I always want to create quality products.",
    },
    {
      id: "02",
      heading: "Team Management",
      desc: "Working with team is also an important thing in programming.",
    },
    {
      id: "03",
      heading: "Creative Mind",
      desc: "Creativity will be the core to develop programs.",
    },
  ];

  // Danh sách ảnh cho Galaxy
  // Bạn có thể tái sử dụng biến 'logo' hoặc import các ảnh khác
  const galaxyImages = [
    logo,
    hexagonImg,
    lumindLogo,
  ];

  return (
    <>
      <section className={`branding ${className}`} style={{ marginTop: "100px" }}>
        <div className='container grid'>
          {data.map((value) => (
            <div key={value.id} className='box flex'>
              <div className="text">
                <h1>{value.id}</h1>
              </div>
              <div className="para">
                <h2>{value.heading}</h2>
                <p>{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '68vh', 
        overflow: 'hidden',
        background: '#000',
        margin: '50px 0' 
      }}>
        <GalaxyAnimation
          text="DINH LUONG TA"
          imageUrls={galaxyImages}
        />
      </div>


      {/* <img width={'100%'} src={logo} alt="Logo" /> */}

      <ParticleTextCanvas />
      <CustomVideoPlayer src={bgVideo} captionSrc={caption} />
      <CustomVideoPlayer src={bgLogoVideo} captionSrc={caption_logo} />
      <CustomVideoPlayer src={lumindAnimationVideo} captionSrc={lumind_animation_text} />
      <Hero />
    </>
  );
};