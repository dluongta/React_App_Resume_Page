import React, { useEffect, useRef, useState } from 'react';
import main_bg from '../../assets/main-background.png';
import iphone from '../../assets/iphone.png';
import iphonex from '../../assets/iphone-x.png';
import ipad from '../../assets/ipad.png';

const ScrollEffect = () => {
  const mainBgRef = useRef(null);
  const overlayContentRef = useRef(null);
  const devicesRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      let progress = scrollTop / (windowHeight * 1.5);
      progress = Math.min(Math.max(progress, 0), 1);

      if (mainBgRef.current) {
        const radius = 100 - progress * 85;
        mainBgRef.current.style.clipPath = `circle(${radius}% at 50% 55%)`;
      }

      const startPoint = 0.8;
      let contentProgress = (progress - startPoint) / (1 - startPoint);
      contentProgress = Math.min(Math.max(contentProgress, 0), 1);

      if (overlayContentRef.current) {
        overlayContentRef.current.style.opacity = contentProgress;
      }

      const [dev1, dev2, dev3, dev4] = devicesRef.current;

      const multiplier = isMobile ? 0.3 : 0.4;
      const horizontalDist = windowWidth * multiplier * contentProgress;
      const verticalDist = (isMobile ? 120 : 300) * contentProgress;
      const extraRight = isMobile ? windowWidth * 0.1 * contentProgress : 0;

      if (dev1) {
        dev1.style.transform = `translate(${-horizontalDist }px, ${-verticalDist * 0.4}px) rotate(${-contentProgress * 15}deg) scale(${isMobile ? 0.8 : 1})`;
      }

      if (dev2) {
        dev2.style.transform = `translate(${horizontalDist + extraRight*0.25}px, ${-verticalDist * 0.3}px) rotate(${contentProgress * 15}deg) scale(${isMobile ? 0.8 : 1})`;
      }

      if (dev3) {
        dev3.style.transform = `translate(${-horizontalDist * 0.9}px, ${verticalDist * 0.6}px) rotate(${-contentProgress * 10}deg) scale(${isMobile ? 0.8 : 1})`;
      }

      if (dev4) {
        dev4.style.transform = `translate(${horizontalDist * 0.9}px, ${verticalDist * 0.6}px) rotate(${contentProgress * 10}deg) scale(${isMobile ? 0.8 : 1})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '350vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ position: 'sticky', top: 0, height: '120vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
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
            padding: '0 20px'
          }}
        >
          <img
            ref={(el) => (devicesRef.current[0] = el)}
            src={iphonex}
            alt="Device 1"
            style={{ position: 'absolute', width: isMobile ? '100px' : '150px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
          />
          <img
            ref={(el) => (devicesRef.current[1] = el)}
            src={ipad}
            alt="Device 2"
            style={{ position: 'absolute', width: isMobile ? '160px' : '250px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
          />
          <img
            ref={(el) => (devicesRef.current[2] = el)}
            src={iphone}
            alt="Device 3"
            style={{ position: 'absolute', width: isMobile ? '110px' : '180px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
          />
          <img
            ref={(el) => (devicesRef.current[3] = el)}
            src={iphonex}
            alt="Device 4"
            style={{ position: 'absolute', width: isMobile ? '110px' : '180px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
          />

          <div
            style={{
              textAlign: 'center',
              color: '#000',
              maxWidth: '500px',
              transform: isMobile ? 'translateY(240px)' : 'translateY(320px)',
              transition: 'transform 0.4s ease-out',
              marginBottom: '100px'
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? '1.6rem' : '2.5rem',
                marginBottom: '12px',
                fontWeight: 700,
                lineHeight: 1.2
              }}
            >
              Thông Minh & Mượt Mà
            </h2>
            <p
              style={{
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                lineHeight: 1.6,
                color: '#444',
                padding: '0 15px'
              }}
            >
              Tận dụng Thuật Toán Đồ Họa và Trinity Engine hoàn toàn mới, mang đến trải nghiệm mượt mà ở mọi tác vụ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollEffect;
