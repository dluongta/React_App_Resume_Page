import React, { useEffect, useRef } from 'react';

const SpiralGalaxy = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // alpha: false báo cho GPU biết nền luôn đặc (đen), tăng tốc độ render đáng kể
    const ctx = canvas.getContext('2d', { alpha: false });

    let width, height, centerX, centerY;
    let cameraDistance = 900;
    let coreGlowRadius = 180;
    let rotationSpeed = 0.003; // Biến lưu tốc độ xoay
    let coreGradient = null;
    let animationFrameId;
    let isVisible = true;

    // Tạo sẵn Gradient 1 lần khi resize thay vì tạo lại 60 lần/giây trong animate()
    const updateGradient = () => {
      if (!width || !height) return;
      coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        coreGlowRadius
      );
      coreGradient.addColorStop(0, 'rgba(255, 140, 50, 0.15)');
      coreGradient.addColorStop(0.5, 'rgba(255, 50, 150, 0.05)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    };

    const resize = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;

      if (width <= 768) {
        cameraDistance = 1500;
        coreGlowRadius = 85;
        rotationSpeed = 0.01;
      } else {
        cameraDistance = 880;
        coreGlowRadius = 180;
        rotationSpeed = 0.003;
      }

      updateGradient();
    };

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', resize);
    resize();

    // Khởi tạo các ngôi sao
    const numStars = 12000;
    const stars = new Array(numStars);
    const focalLength = 500;
    const galaxyRadius = 500;
    const numArms = 4; // 4 đường spiral
    const armSpin = 4.5;

    for (let i = 0; i < numStars; i++) {
      const normalizedR = Math.pow(Math.random(), 1.8);
      const r = normalizedR * galaxyRadius;
      const armIndex = Math.floor(Math.random() * numArms);
      const armAngle = ((Math.PI * 2) / numArms) * armIndex;
      const angle = armAngle + normalizedR * armSpin;

      const scatterDist = (Math.random() - 0.5) * (10 + normalizedR * 130);
      const randomAngle = Math.random() * Math.PI * 2;

      const x = Math.cos(angle) * r + Math.cos(randomAngle) * scatterDist;
      const y = Math.sin(angle) * r + Math.sin(randomAngle) * scatterDist;
      const z = (Math.random() - 0.5) * 8; // Galaxy dẹt hoàn toàn

      // Làm tròn màu theo bội số nhỏ để gom nhóm các ngôi sao có màu giống hệt nhau
      let h = Math.round((35 - normalizedR * 115 + (Math.random() - 0.5) * 20) / 2) * 2;
      if (h < 0) h += 360;

      const s = Math.round((80 + Math.random() * 20) / 5) * 5;
      const l = Math.round((65 - normalizedR * 20 + Math.random() * 15) / 5) * 5;

      stars[i] = {
        originalX: x,
        originalY: y,
        originalZ: z,
        color: `hsl(${h},${s}%,${l}%)`,
        pSideBase: (Math.random() * 1.5 + 0.2) * 1.4, // Nhân sẵn 1.4 từ đầu
      };
    }

    // Sắp xếp các ngôi sao cùng màu đứng cạnh nhau để không phải đổi ctx.fillStyle liên tục
    stars.sort((a, b) => (a.color < b.color ? -1 : a.color > b.color ? 1 : 0));

    // Các góc xoay cố định (chỉ tự xoay quanh trục Z)
    const rotationX = -1.22;
    let rotationZ = 0;

    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    // Vòng lặp Render siêu tối ưu
    const animate = () => {
      if (!isVisible) return;

      animationFrameId = requestAnimationFrame(animate);

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Áp dụng biến tốc độ xoay đã cấu hình theo màn hình
      rotationZ -= rotationSpeed;

      const cosZ = Math.cos(rotationZ);
      const sinZ = Math.sin(rotationZ);

      let lastColor = '';

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        const x1 = star.originalX * cosZ - star.originalY * sinZ;
        const y1 = star.originalX * sinZ + star.originalY * cosZ;
        const z1 = star.originalZ;

        // Đã rút gọn phép tính với rotationY = 0 (cosY = 1, sinY = 0)
        const y2 = y1 * cosX - z1 * sinX;
        const z3 = y1 * sinX + z1 * cosX + cameraDistance;

        if (z3 > 0) {
          const scale = focalLength / z3;
          const screenX = centerX + x1 * scale;
          const screenY = centerY + y2 * scale;
          const pSide = star.pSideBase * scale;

          // Bỏ qua các ngôi sao nằm ngoài màn hình
          if (
            screenX >= -pSide &&
            screenX <= width + pSide &&
            screenY >= -pSide &&
            screenY <= height + pSide
          ) {
            // Chỉ đổi màu cọ vẽ khi ngôi sao tiếp theo có màu khác ngôi sao trước
            if (star.color !== lastColor) {
              ctx.fillStyle = star.color;
              lastColor = star.color;
            }
            ctx.fillRect(screenX - pSide * 0.5, screenY - pSide * 0.5, pSide, pSide);
          }
        }
      }

      // Vẽ ánh sáng lõi từ Gradient đã cache
      if (coreGradient) {
        ctx.fillStyle = coreGradient;
        ctx.fillRect(0, 0, width, height);
      }
    };

    // Tự động tạm dừng render khi người dùng cuộn qua khỏi tầm nhìn
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          animate();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );

    if (canvas.parentElement) {
      intersectionObserver.observe(canvas.parentElement);
    }

    animate();

    // Cleanup khi component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>
        {`
          .spiral-galaxy-wrapper {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #000;
            width: 100%;
            height: 100vh;
            margin-bottom: 36px; /* Mặc định trên PC là 36px */
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Màn hình Mobile (nhỏ hơn hoặc bằng 768px) */
          @media (max-width: 768px) {
            .spiral-galaxy-wrapper {
              height: 60vh; /* Chiều cao trên Mobile là 60vh */
              margin-bottom: 45px; /* Trên Mobile cách dưới 45px */
            }
          }
        `}
      </style>
      <div className="spiral-galaxy-wrapper">
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
};

export default SpiralGalaxy;