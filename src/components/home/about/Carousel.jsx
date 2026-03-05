import React, { useEffect, useState, useRef, useCallback } from "react";
import heroImage1 from "../../../assets/luen.jpg";
import heroImage2 from "../../../assets/luen_logo.png";
import heroImage3 from "../../../assets/hexagon-main.png";
import "./Carousel.css";

const Carousel = () => {
  const images = [heroImage1, heroImage2, heroImage3];
  
  // Tạo danh sách slide với bản sao ở hai đầu để tạo hiệu ứng vô tận
  const slides = [images[images.length - 1], ...images, images[0]];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  // Hàm chuyển slide tiếp theo - dùng useCallback để tránh tạo lại hàm liên tục
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

  // Tự động chạy slide
  useEffect(() => {
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timerRef.current);
  }, [nextSlide]);

  const handleTransitionEnd = () => {
    setIsAnimating(false);

    // Nếu đang ở slide cuối (bản sao của slide 1), nhảy về slide 1 thật
    if (currentIndex === slides.length - 1) {
      setTransition(false);
      setCurrentIndex(1);
    }

    // Nếu đang ở slide đầu (bản sao của slide cuối), nhảy về slide cuối thật
    if (currentIndex === 0) {
      setTransition(false);
      setCurrentIndex(images.length);
    }
  };

  // Xác định dot nào đang active
  // Logic này giúp tránh việc không có dot nào sáng khi đang ở các slide "clone"
  const getActiveDot = () => {
    if (currentIndex === 0) return images.length - 1;
    if (currentIndex === slides.length - 1) return 0;
    return currentIndex - 1;
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
      >
        {slides.map((img, index) => (
          <div className="carousel-item" key={index}>
            <img src={img} alt={`slide-${index}`} />
          </div>
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