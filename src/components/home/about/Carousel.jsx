import React, { useEffect, useState, useRef, useCallback } from "react";
import heroImage1 from "../../../assets/luen.jpg";
import heroImage2 from "../../../assets/luen_logo.png";
import heroImage3 from "../../../assets/hexagon-main.png";
import "./Carousel.css";


const Carousel = () => {
  const images = [heroImage1, heroImage2, heroImage3];
  
  const slides = [images[images.length - 1], ...images, images[0]];
  const startX = useRef(0);
  const isDragging = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const goToSlide = (index) => {
    if (isAnimating || currentIndex === index + 1) return;
    setIsAnimating(true);
    setTransition(true);
    setCurrentIndex(index + 1);
  };

  // useEffect(() => {
  //   timerRef.current = setInterval(() => {
  //     nextSlide();
  //   }, 3000);

  //   return () => clearInterval(timerRef.current);
  // }, [nextSlide]);
useEffect(() => {
  timerRef.current = setInterval(() => {
    if (!isDragging.current) {
      nextSlide();
    }
  }, 3000);

  return () => clearInterval(timerRef.current);
}, [nextSlide]);
  const handleTransitionEnd = () => {
    setIsAnimating(false);

    if (currentIndex === slides.length - 1) {
      setTransition(false);
      setCurrentIndex(1);
    }

    if (currentIndex === 0) {
      setTransition(false);
      setCurrentIndex(images.length);
    }
  };

  const getActiveDot = () => {
    if (currentIndex === 0) return images.length - 1;
    if (currentIndex === slides.length - 1) return 0;
    return currentIndex - 1;
  };

  const handleStart = (clientX) => {
  startX.current = clientX;
  isDragging.current = true;
};

const handleMove = (clientX) => {
  if (!isDragging.current) return;
};

const handleEnd = (clientX) => {
  if (!isDragging.current) return;

  const diff = clientX - startX.current;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  }

  isDragging.current = false;
};

  return (
    <div className="carousel">
      <div
        className="carousel-inner"
  style={{
    transform: `translateX(-${currentIndex * 100}%)`,
    transition: transition ? "transform 0.5s ease-in-out" : "none",
  }}
  onTransitionEnd={handleTransitionEnd}

  onMouseDown={(e) => handleStart(e.clientX)}
  onMouseUp={(e) => handleEnd(e.clientX)}
  onMouseLeave={(e) => handleEnd(e.clientX)}

  onTouchStart={(e) => handleStart(e.touches[0].clientX)}
  onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
      >
        {slides.map((img, index) => (
          <div className="carousel-item" key={index}>
            {/* <img src={img} alt={`slide-${index}`} /> */}
    <img
      src={img}
      alt={`slide-${index}`}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    />          </div>
        ))}
      </div>

      <button className="carousel-button prev" onClick={prevSlide} disabled={isAnimating}>
        ❮
      </button>

      <button className="carousel-button next" onClick={nextSlide} disabled={isAnimating}>
        ❯
      </button>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${getActiveDot() === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;