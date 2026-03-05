import React, { useEffect, useState, useRef } from "react";
import heroImage1 from "../../../assets/luen.jpg";
import heroImage2 from "../../../assets/luen_logo.png";
import heroImage3 from "../../../assets/hexagon-main.png";
import "./Carousel.css";

const Carousel = () => {
  const images = [heroImage1, heroImage2, heroImage3];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [transition, setTransition] = useState(true);

  const carouselRef = useRef();

  const slides = [images[images.length - 1], ...images, images[0]];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
    setTransition(true);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
    setTransition(true);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index + 1);
    setTransition(true);
  };

  const handleTransitionEnd = () => {
    if (currentIndex === slides.length - 1) {
      setTransition(false);
      setCurrentIndex(1);
    }

    if (currentIndex === 0) {
      setTransition(false);
      setCurrentIndex(images.length);
    }
  };

  return (
    <div className="carousel">
      <div
        ref={carouselRef}
        className="carousel-inner"
        style={{
          transform: `translateX(-${currentIndex * 100}vw)`,
          transition: transition ? "transform 0.5s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((img, index) => (
          <div className="carousel-item" key={index}>
            <img src={img} alt={`slide-${index}`} />
          </div>
        ))}
      </div>

      <button className="carousel-button prev" onClick={prevSlide}>
        ❮
      </button>

      <button className="carousel-button next" onClick={nextSlide}>
        ❯
      </button>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index + 1 ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;