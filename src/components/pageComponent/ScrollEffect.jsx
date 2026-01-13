import React, { useEffect, useRef } from 'react';
import main_bg from '../../assets/main-background.png'
import iphone from '../../assets/iphone.png'
import iphonex from '../../assets/iphone-x.png'
import ipad from '../../assets/ipad.png'

const ScrollEffect = () => {
  // Khởi tạo các Refs để truy cập DOM
  const mainBgRef = useRef(null);
  const overlayContentRef = useRef(null);
  const devicesRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // 1. Tính toán progress tổng (từ 0 đến 1)
      let progress = scrollTop / (windowHeight * 1.5);
      progress = Math.min(Math.max(progress, 0), 1);

      // 2. Hiệu ứng Clip-path cho hình nền
      if (mainBgRef.current) {
        const radius = 100 - progress * 85;
        mainBgRef.current.style.clipPath = `circle(${radius}% at 50% 40%)`;
      }

      // 3. Tính toán progress riêng cho nội dung (chỉ hiện sau 80% tiến trình cuộn)
      const startPoint = 0.8;
      let contentProgress = (progress - startPoint) / (1 - startPoint);
      contentProgress = Math.min(Math.max(contentProgress, 0), 1);

      if (overlayContentRef.current) {
        overlayContentRef.current.style.opacity = contentProgress;
      }

      // 4. Hiệu ứng bung các thiết bị
      const [dev1, dev2, dev3, dev4] = devicesRef.current;
      const topDist = contentProgress * 400;
      const sideDist = contentProgress * 320;
      const downDist = contentProgress * 200;

      if (dev1) dev1.style.transform = `translate(${-topDist}px, ${-topDist * 0.5}px) rotate(${-contentProgress * 20}deg)`;
      if (dev2) dev2.style.transform = `translate(${topDist}px, ${-topDist * 0.3}px) rotate(${contentProgress * 20}deg)`;
      if (dev3) dev3.style.transform = `translate(${-sideDist}px, ${downDist}px) rotate(${-contentProgress * 15}deg)`;
      if (dev4) dev4.style.transform = `translate(${sideDist}px, ${downDist}px) rotate(${contentProgress * 15}deg)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '350vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ position: 'sticky', top: 80, height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        
        {/* Hình nền chính */}
        <img
          ref={mainBgRef}
          src={main_bg}
          alt="Background"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            clipPath: 'circle(100% at 50% 50%)',
            transition: 'clip-path 0.1s ease-out'
          }}
        />

        {/* Lớp nội dung bên trên */}
        <div
          ref={overlayContentRef}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Thiết bị trên */}
          <img
            ref={(el) => (devicesRef.current[0] = el)}
            src={iphonex}
            style={{ position: 'absolute', width: '150px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
            alt="Device 1"
          />
          <img
            ref={(el) => (devicesRef.current[1] = el)}
            src={ipad}
            style={{ position: 'absolute', width: '250px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
            alt="Device 2"
          />

          {/* Thiết bị dưới */}
          <img
            ref={(el) => (devicesRef.current[2] = el)}
            src={iphone}
            style={{ position: 'absolute', width: '180px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
            alt="Device 3"
          />
          <img
            ref={(el) => (devicesRef.current[3] = el)}
            src="https://img.icons8.com/plasticine/400/iphone-x.png"
            style={{ position: 'absolute', width: '180px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
            alt="Device 4"
          />

          {/* Văn bản trung tâm */}
          <div style={{ textAlign: 'center', color: '#000', maxWidth: '500px', transform: 'translateY(180px)' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px', fontWeight: 600 }}>Thông Minh & Mượt Mà</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#555' }}>
              Tận dụng Thuật Toán Đồ Họa và Trinity Engine hoàn toàn mới, mang đến trải nghiệm mượt mà ở mọi tác vụ.
            </p>
          </div>
        </div>
      </div>

      {/* Footer hoặc nội dung tiếp theo */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <p style={{ fontSize: '1.5rem', color: '#999' }}>Cuộn xuống để xem thêm...</p>
      </div>
    </div>
  );
};

export default ScrollEffect;