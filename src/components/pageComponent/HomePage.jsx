import React, { useEffect } from 'react';
import { About } from '../home/about/About';
import { Branding } from '../home/header/homes/Branding';
import { Home } from '../home/header/homes/Home';
import { Skill } from '../home/header/homes/Skill';
import { WrapperOne } from '../home/header/homes/WrapperOne';
import { Service } from '../home/services/Service';
import { Wrapper } from '../home/Wrapper';
import { Link } from 'react-router-dom';
import hexagon from '../../assets/hexagon.png';
import { ScrollRevealText } from './ScrollRevealText';
// import Particles from 'react-tsparticles';
// import { loadSlim } from 'tsparticles-slim'; 
import ScrollEffect from './ScrollEffect';
import ScrollHero from './ScrollHero';
import { FireworksEffect } from './FireworksEffect';
import { FireworkButton } from './FireworkButton';
import { ScrollText } from './ScrollText';
import SplitFlapLog from './SplitFlapLog';
import { CounterSection } from './CounterSection';
import DotField from './DotField';

export const HomePage = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');

    const handleScroll = () => {
      revealElements.forEach((element) => {
        const { top } = element.getBoundingClientRect();
        if (top < window.innerHeight - 100) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  // const particlesOptions = {
  //   fullScreen: {
  //     enable: true, 
  //     zIndex: 1000,  
  //   },
  //   interactivity: {
  //     events: {
  //       onClick: {
  //         enable: true, 
  //         mode: "push", 
  //       },
  //       onHover: {
  //         enable: true, 
  //         mode: "repulse", 
  //       },
  //     },
  //     modes: {
  //       push: {
  //         quantity: 10, 
  //       },
  //       repulse: {
  //         distance: 100, 
  //       },
  //     },
  //   },
  //   particles: {
  //     number: {
  //       value: 50, 
  //     },
  //     size: {
  //       value: 12, 
  //     },
  //     shape: {
  //       type: 'image',
  //       image: [
  //         {
  //           src: hexagon, 
  //           width: 20,    
  //           height: 20,  
  //         },
  //       ],
  //     },
  //     move: {
  //       enable: true,
  //       speed: 8, 
  //       direction: 'bottom',
  //       random: true, 
  //       straight: false, 
  //     },
  //     opacity: {
  //       value: 0.8, 
  //     },
  //   },
  // };

  // const particlesInit = (engine) => {
  //   loadSlim(engine); 
  // };

  return (
    <>

      {/* <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{
          position: 'fixed', 
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1000, 
        }}
      /> */}
      {/* <FireworksEffect />
      <FireworkButton /> */}

      {/* <div id="mySidenav" className="sidenav">
        <Link to='/pages' id="pages"> Pages </Link>
        <Link to='/blog' id="blog"> Blog </Link>
        <Link to='/portfolio' id="portfolio"> Portfolio </Link>
        <Link to='/contact' id="contact"> Contact </Link>
        <Link to='/galaxy' id="galaxy"> Galaxy </Link>
      </div> */}
      {/* <ScrollEffect/>  */}
      <section className="portfolio-hero">
        <DotField
          dotRadius={1}
          dotSpacing={14}
          cursorRadius={300}
          bulgeStrength={50}
          bulgeOnly
          gradientFrom="rgba(139,92,246,0.9)"
          gradientTo="rgba(168,85,247,0.9)"
        />
        <div className="portfolio-content">
          <span className="portfolio-badge">
            ✦ Available for job
          </span>

          <h1>
            Building Modern
            <br />
            Web Experiences
          </h1>

          <p>
            React Developer creating high-quality,
            performant and interactive digital products.
          </p>

          <div className="portfolio-actions">
            <button className="btn-primary">
              View Projects
            </button>

            <button className="btn-secondary">
              Contact Me
            </button>
          </div>
        </div>
      </section>
      <Home className="reveal" />
      <Branding className="reveal" />
      <About className="reveal" />
      <Wrapper className="reveal" />
      <ScrollRevealText />
      <ScrollText />
      {/* <ScrollHero/> */}
      <Skill className="reveal" />
      <Service className="reveal" />
      <CounterSection className="reveal" />
      <WrapperOne className="reveal" />
      <SplitFlapLog className="reveal" />
    </>
  );
};
