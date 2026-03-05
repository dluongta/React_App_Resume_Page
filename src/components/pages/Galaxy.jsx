import {useEffect,useState} from "react";
import { Link } from "react-router-dom";

import GalaxyAnimation from "../home/header/homes/GalaxyAnimation";

import logo from "../../assets/luen_logo.png";
import lumindLogo from "../../assets/luen-1.jpg";
import hexagonImg from "../../assets/hexagon-main.png";

export const Galaxy = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const galaxyImages = [
    logo,
    hexagonImg,
    lumindLogo,
  ];
  return (
    <>
      <section className="galaxy-page">

        <div id="mySidenav" className="sidenav">
          <Link to="/pages" id="pages">Pages</Link>
          <Link to="/blog" id="blog">Blog</Link>
          <Link to="/portfolio" id="portfolio">Portfolio</Link>
          <Link to="/contact" id="contact">Contact</Link>
          <Link to="/galaxy" id="galaxy">Galaxy</Link>
        </div>

       <div className="galaxy-container-wrapper">
        <GalaxyAnimation
          text="DINH LUONG TA"
          imageUrls={galaxyImages}
        />
      </div>
      </section>
    </>
  );
};