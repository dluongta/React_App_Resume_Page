import { React, useEffect, useState } from 'react';
import logo from '../../../../assets/luen_logo.png';
import GalaxyAnimation from './GalaxyAnimation';
import lumindLogo from '../../../../assets/luen-1.jpg';
import Hero from './Hero';
import CustomVideoPlayer from './CustomVideoPlayer';
import caption_logo from '../../../../assets/caption_logo.vtt';
import bgLogoVideo from '../../../../assets/lumind_logo.mp4';
import ParticleTextCanvas from "./ParticleTextCanvas";
import hexagonImg from '../../../../assets/hexagon-main.png';
import CustomMusicPlayer from './CustomMusicPlayer';
import bgMusic from '../../../../assets/Study-Pop-Playlist.mp3';
// import CircularText from './CircularText';

export const Branding = ({ className }) => {
  const data = [
    {
      id: "01",
      heading: "Digital Branding",
      desc: "I always want to create quality products.",
    },
    {
      id: "02",
      heading: "Efficient Performance",
      desc: "High performance is also important in programming.",
    },
    {
      id: "03",
      heading: "Outstanding Skills",
      desc: "Outstanding skills will be the core to develop programs.",
    },
  ];


  const galaxyImages = [
    logo,
    hexagonImg,
    lumindLogo,
  ];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <>
      <section
        className={`branding ${className}`}
        style={{ marginTop: "100px" }}
      >
        <div
          className="branding-container"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "20px",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "16px" : "0 16px",
            boxSizing: "border-box",
            marginTop: "21px",
          }}
        >
          {data.map((value) => (
            <div
              key={value.id}
              className="box"
              style={{
                display: "flex",
                gap: "30px",
                padding: isMobile ? "20px 0" : "30px",
              }}
            >
              <div className="text">
                <h1
                  style={{
                    fontSize: "48px",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {value.id}
                </h1>
              </div>

              <div className="para">
                <h2
                  style={{
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  {value.heading}
                </h2>

                <p
                  style={{
                    color: "#fff",
                    lineHeight: "1.6",
                  }}
                >
                  {value.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '40px',
        margin: '18px auto',
        width: '100%',
        maxWidth: '1200px',
      }}>
        <CircularText text="DIGITAL ✦ BRANDING ✦ PRODUCTS ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="TEAM ✦ MANAGEMENT ✦ SKILLS ✦ " color="#FFA500" onHover="slowDown" />
        <CircularText text="CREATIVE ✦ MIND ✦ DEVELOPER ✦ " color="#FFA500" onHover="pause" />
        <CircularText text="DLUONGTA ✦ TSCEND ✦ STUDIO ✦ " color="#FFA500" onHover="goBonkers" />
        <CircularText text="CREATIVE ✦ DLUONGTA ✦ TSCEND ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="SKILLED ✦ WEB ✦ DEVELOPER ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="SKILLED ✦ ANDROID ✦ DEVELOPER ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="SKILLED ✦ APP ✦ DEVELOPER ✦ " color="#FFA500" onHover="speedUp" />
      </div> */}
      
      <GalaxyAnimation
        text="DINH LUONG TA"
        imageUrls={galaxyImages}
      />
      <ParticleTextCanvas />
      <CustomVideoPlayer src={bgLogoVideo} captionSrc={caption_logo} />
      {/* <CustomMusicPlayer
        src={bgMusic}
        title="Study Pop Playlist"
        artist="DLUONGTA"
      /> */}
      <CustomMusicPlayer
        src={bgMusic}
        title="Study Pop Playlist"
        artist="DLUONGTA"
        useImage={true}
        cover={hexagonImg}
      />
      <Hero />
    </>
  );
};
