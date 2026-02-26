import React, { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";

export const FireworksEffect = () => {
  const containerRef = useRef(null);
  const fireworksInstance = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    // Khởi tạo nhưng không cho tự chạy dồn dập
    fireworksInstance.current = new Fireworks(container, {
      rocketsPoint: { min: 50, max: 50 },
      hue: { min: 0, max: 360 },
      delay: { min: 30, max: 60 },
      speed: 2,
      acceleration: 1.05,
      friction: 0.95,
      gravity: 1.4,
      particles: 90,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 8,
      intensity: 5, 
      autoresize: true,
      brightness: { min: 50, max: 80 },
      opacity: 0.6,
    });

    // Tạo hàm global để nút bấm có thể gọi
    window.manualLaunch = () => {
      if (fireworksInstance.current) {
        // Vòng lặp bắn 10 quả
        for (let i = 0; i < 10; i++) {
          fireworksInstance.current.launch();
        }
      }
    };

    fireworksInstance.current.start();

    return () => {
      fireworksInstance.current.stop();
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Để không cản trở việc click vào các phần tử khác trên web
        zIndex: 99999,
      }}
    />
  );
};