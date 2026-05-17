import { React, useEffect, useState } from 'react';
import logo from '../../../../assets/luen_logo.png';
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
import hexagonImg from '../../../../assets/hexagon-main.png';
import CurvedLoop from './CurvedLoop';
import CircularText from './CircularText';
// import caption_ulmind_intro from '../../../../assets/caption_intro.vtt';
// import ulmind_intro from '../../../../assets/ultramind_intro.mp4';
// import Globe from './GlobeVisualization';

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
      <CurvedLoop
        marqueeText="Be ✦ Creative ✦ With ✦ DLUONGTA ✦ ULMIND ✦"
        speed={10}
        curveAmount={400}
        direction="right"
        interactive
        className="custom-text-style"
      />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '40px',
        margin: '60px auto',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {/* <CircularText text="DIGITAL ✦ BRANDING ✦ PRODUCTS ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="TEAM ✦ MANAGEMENT ✦ SKILLS ✦ " color="#FFA500" onHover="slowDown" />
        <CircularText text="CREATIVE ✦ MIND ✦ DEVELOPER ✦ " color="#FFA500" onHover="pause" />
        <CircularText text="DLUONGTA ✦ ULMIND ✦ STUDIO ✦ " color="#FFA500" onHover="goBonkers" /> */}
        <CircularText text="DLUONGTA ✦ FUTURE ✦ CREATIVE ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="FANTASTIC ✦ SOFTWARE ✦ DEVELOPER ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="SKILLED ✦ HARDWARE ✦ ENGINEER ✦ " color="#FFA500" onHover="speedUp" />
        <CircularText text="DIGITAL ✦ ULMIND ✦ SYSTEMS ✦ " color="#FFA500" onHover="speedUp" />
      </div>      {/* {!isMobile && (
        <div style={{
          position: 'relative',
          width: '80%',
          height: '100vh',
          overflow: 'hidden',
          background: '#000',
          margin: '0 auto',
          marginTop: '30px'
        }} className='galaxy'>

          <GalaxyAnimation
            text="DINH LUONG TA"
            imageUrls={galaxyImages}
          />

        </div>

      )} */}
      {/* <img width={'100%'} src={logo} alt="Logo" /> */}
      <ParticleTextCanvas />
      {/* <CustomVideoPlayer src={ulmind_intro} captionSrc={caption_ulmind_intro} /> */}
      <CustomVideoPlayer src={bgLogoVideo} captionSrc={caption_logo} />
      {/* <CustomVideoPlayer src={lumindAnimationVideo} captionSrc={lumind_animation_text} /> */}
      {/* <CustomVideoPlayer src={bgVideo} captionSrc={caption} /> */}
      <Hero />
    </>
  );
};