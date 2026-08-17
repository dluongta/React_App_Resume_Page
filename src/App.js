import React, { useEffect, useRef } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';

import { Header } from './components/homes/header/Header';
import { HomePage } from './components/homes/HomePage';
import { Footer } from './components/homes/footer/Footer';
import { Web } from './components/pages/Web';
import { AppComponent } from './components/pages/App';
import { Android } from './components/pages/Android';
import { Resume } from './components/pages/Resume';
import ScrollToTopButton from './components/homes/ScrollToTopButton';
import CustomScrollbar from './components/homes/CustomScrollbar';

const TRAIL_COLORS = [
  '#00aaff',
  '#00c6ff',
  '#00e5ff',
  '#58dfff',
];

const TEXT_SELECTOR = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li', 'label',
  'strong', 'b', 'em', 'i', 'small', 'code', 'pre', 'blockquote',
  'dt', 'dd', 'figcaption', 'article', 'section', 'td', 'th', 'caption',
].join(',');

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return undefined;
    }

    let lastTrailTime = 0;
    let isTouchDevice = false;
    let audioCtx = null; // Biến lưu trữ AudioContext

    const particles = new Set();
    const effects = new Set();

    const checkTouchDevice = () => {
      isTouchDevice = window.matchMedia(
        '(hover: none), (pointer: coarse)'
      ).matches;

      cursor.classList.toggle(
        'cursor-disabled',
        isTouchDevice
      );
    };

    const clearTrails = () => {
      particles.forEach((particle) => {
        window.clearTimeout(Number(particle.dataset.timer));
        particle.remove();
      });
      particles.clear();
    };

    const clearEffects = () => {
      effects.forEach((effect) => {
        window.clearTimeout(Number(effect.dataset.timer));
        effect.remove();
      });
      effects.clear();
    };

    const createTrail = (x, y) => {
      const trail = document.createElement('span');
      const size = 3 + Math.random() * 6;
      const offsetX = (Math.random() - 0.5) * 12;
      const offsetY = (Math.random() - 0.5) * 12;
      const color = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];

      trail.className = 'cursor-trail';
      trail.style.left = `${x + offsetX}px`;
      trail.style.top = `${y + offsetY}px`;
      trail.style.width = `${size}px`;
      trail.style.height = `${size}px`;
      trail.style.setProperty('--particle-color', color);

      document.body.appendChild(trail);
      particles.add(trail);

      const timer = window.setTimeout(() => {
        trail.remove();
        particles.delete(trail);
      }, 650);

      trail.dataset.timer = String(timer);
    };

    const createClickEffect = (x, y) => {
      const effect = document.createElement('span');
      effect.className = 'cursor-click-effect';
      effect.style.left = `${x}px`;
      effect.style.top = `${y}px`;

      document.body.appendChild(effect);
      effects.add(effect);

      const timer = window.setTimeout(() => {
        effect.remove();
        effects.delete(effect);
      }, 750);

      effect.dataset.timer = String(timer);
    };

    // --- HÀM TẠO ÂM THANH BẰNG WEB AUDIO API ---
    const playClickSound = () => {
      // Khởi tạo AudioContext một lần duy nhất để tối ưu hiệu suất
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Trình duyệt thường chặn audio cho đến khi có tương tác, cần resume nếu bị suspended
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Cấu hình âm thanh (Tùy chỉnh để có tiếng click êm tai)
      oscillator.type = 'square'; // Loại sóng: sine, square, sawtooth, triangle
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Tần số ban đầu (Hz)
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1); // Giảm tần số nhanh

      // Cấu hình âm lượng
      gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime); // Âm lượng ban đầu (0.8)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1); // Giảm âm lượng về 0

      // Kết nối các node
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Phát và dừng âm thanh trong 0.1 giây
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    };

    const handleMouseMove = (event) => {
      if (isTouchDevice) {
        return;
      }

      const { clientX, clientY } = event;
      cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;

      const now = performance.now();

      if (now - lastTrailTime >= 28) {
        let trailX = clientX;
        let trailY = clientY;

        if (cursor.classList.contains('cursor-text')) {
          trailX = clientX;
          trailY = clientY - 20;
        }

        createTrail(trailX, trailY);
        lastTrailTime = now;
      }
    };

    const handleMouseEnter = () => {
      if (!isTouchDevice) {
        cursor.classList.remove('cursor-hidden');
      }
    };

    const handleMouseLeave = () => {
      cursor.classList.add('cursor-hidden');
      clearTrails();
      clearEffects();
    };

    const handleMouseDown = (event) => {
      // Phát âm thanh khi click
      playClickSound();

      if (isTouchDevice) {
        return;
      }

      cursor.classList.add('cursor-clicking');

      let clickX = event.clientX;
      let clickY = event.clientY;

      if (cursor.classList.contains('cursor-text')) {
        clickY = event.clientY - 20;
      }

      createClickEffect(clickX, clickY);
    };

    const handleMouseUp = () => {
      cursor.classList.remove('cursor-clicking');
    };

    const handleMouseOver = (event) => {
      if (isTouchDevice) return;

      const target = event.target;
      cursor.classList.remove('cursor-link', 'cursor-text', 'cursor-grab', 'cursor-grabbing');

      if (target.closest?.('input[type="text"], input[type="email"], input[type="search"], input[type="password"], textarea, [contenteditable="true"]')) {
        clearTrails();
        clearEffects();
        cursor.classList.add('cursor-text');
        return;
      }

      if (target.closest?.('a, button, [role="button"]')) {
        cursor.classList.add('cursor-link');
        return;
      }

      // --- [ĐOẠN CODE THÊM VÀO ĐỂ FIX LỖI ẢNH] ---
      // Nếu mục tiêu hover là ảnh, SVG, hoặc media -> Bỏ qua kiểm tra text để giữ nguyên con trỏ tam giác
      if (target.closest?.('img, picture, svg, video, canvas')) {
        return;
      }
      // -------------------------------------------

      const textElement = target.closest?.(TEXT_SELECTOR);

      if (textElement) {
        // Kiểm tra kĩ hơn: Đảm bảo phần tử con thực sự chứa text chứ không chỉ bọc ảnh
        const text = textElement.textContent?.trim();
        if (text && text.length > 0) {
          clearTrails();
          clearEffects();
          cursor.classList.add('cursor-text');
          return;
        }
      }

      if (target.closest?.('[draggable="true"]')) {
        cursor.classList.add('cursor-grab');
      }
    };

    const handleDragStart = () => {
      cursor.classList.remove('cursor-grab');
      cursor.classList.add('cursor-grabbing');
    };

    const handleDragEnd = () => {
      cursor.classList.remove('cursor-grabbing');
    };

    checkTouchDevice();

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    window.addEventListener('resize', checkTouchDevice);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      window.removeEventListener('resize', checkTouchDevice);

      clearTrails();
      clearEffects();

      // Đóng audio context khi component unmount
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      aria-hidden="true"
    >
      <svg
        className="cursor-arrow"
        viewBox="0 0 40 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 2 L4 38 L14 28 L21 44 L27 41 L20 25 L35 25 Z"
          fill="#00aaff"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      <span className="cursor-core" />

      <span className="cursor-text-caret">
        <span className="caret-top" />
        <span className="caret-line" />
        <span className="caret-bottom" />
      </span>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById('root');
    const isSubPage =
      location.pathname.startsWith('/web') ||
      location.pathname.startsWith('/android') ||
      location.pathname.startsWith('/app');

    if (root) {
      root.classList.toggle('sub-root', isSubPage);
    }
    document.body.classList.toggle('sub-root', isSubPage);

    return () => {
      if (root) {
        root.classList.remove('sub-root');
      }
      document.body.classList.remove('sub-root');
    };
  }, [location.pathname]);

  return (
    <>
      <CustomScrollbar />
      <CustomCursor />
      <Header />

      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/web" exact component={Web} />
        <Route path="/app" exact component={AppComponent} />
        <Route path="/android" exact component={Android} />
        <Route path="/resume" exact component={Resume} />
      </Switch>

      <Footer />
      <ScrollToTopButton />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;