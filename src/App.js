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


// ============================================================
// CUSTOM CURSOR
// ============================================================

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return undefined;
    }

    let lastTrailTime = 0;
    let isTouchDevice = false;

    const particles = new Set();
    const effects = new Set();

    // --------------------------------------------------------
    // Check touch device
    // --------------------------------------------------------

    const checkTouchDevice = () => {
      isTouchDevice =
        window.matchMedia('(hover: none), (pointer: coarse)').matches;

      if (isTouchDevice) {
        cursor.classList.add('cursor-disabled');
      } else {
        cursor.classList.remove('cursor-disabled');
      }
    };

    checkTouchDevice();

    window.addEventListener('resize', checkTouchDevice);


    // --------------------------------------------------------
    // Move cursor
    // --------------------------------------------------------

    const handleMouseMove = (event) => {
      if (isTouchDevice) {
        return;
      }

      const { clientX, clientY } = event;

      cursor.style.transform =
        `translate3d(${clientX}px, ${clientY}px, 0)`;


      // ------------------------------------------------------
      // Create particle trail
      // ------------------------------------------------------

      const now = performance.now();

      if (now - lastTrailTime >= 28) {
        createTrail(clientX, clientY);
        lastTrailTime = now;
      }
    };


    // --------------------------------------------------------
    // Mouse enter
    // --------------------------------------------------------

    const handleMouseEnter = () => {
      cursor.classList.remove('cursor-hidden');
    };


    // --------------------------------------------------------
    // Mouse leave
    // --------------------------------------------------------

    const handleMouseLeave = () => {
      cursor.classList.add('cursor-hidden');
    };


    // --------------------------------------------------------
    // Mouse down
    // --------------------------------------------------------

    const handleMouseDown = (event) => {
      if (isTouchDevice) {
        return;
      }

      cursor.classList.add('cursor-clicking');

      createClickEffect(
        event.clientX,
        event.clientY
      );
    };


    // --------------------------------------------------------
    // Mouse up
    // --------------------------------------------------------

    const handleMouseUp = () => {
      cursor.classList.remove('cursor-clicking');
    };


    // --------------------------------------------------------
    // Detect element under cursor
    // --------------------------------------------------------

    const handleMouseOver = (event) => {
      if (isTouchDevice) {
        return;
      }

      const target = event.target;

      cursor.classList.remove(
        'cursor-link',
        'cursor-text',
        'cursor-grab',
        'cursor-grabbing'
      );


      // Link / button
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]')
      ) {
        cursor.classList.add('cursor-link');
        return;
      }


      // Text input
      if (
        target.matches?.(
          'input[type="text"], input[type="email"], input[type="search"], input[type="password"], textarea'
        )
      ) {
        cursor.classList.add('cursor-text');
        return;
      }


      // Draggable
      if (
        target.closest?.(
          '[draggable="true"]'
        )
      ) {
        cursor.classList.add('cursor-grab');
      }
    };


    // --------------------------------------------------------
    // Drag start
    // --------------------------------------------------------

    const handleDragStart = () => {
      cursor.classList.remove('cursor-grab');
      cursor.classList.add('cursor-grabbing');
    };


    // --------------------------------------------------------
    // Drag end
    // --------------------------------------------------------

    const handleDragEnd = () => {
      cursor.classList.remove('cursor-grabbing');
    };


    // ========================================================
    // CREATE TRAIL
    // ========================================================

    const createTrail = (x, y) => {
      const trail = document.createElement('span');

      trail.className = 'cursor-trail';

      const size = 3 + Math.random() * 6;

      const offsetX =
        (Math.random() - 0.5) * 12;

      const offsetY =
        (Math.random() - 0.5) * 12;

      trail.style.left =
        `${x + offsetX}px`;

      trail.style.top =
        `${y + offsetY}px`;

      trail.style.width =
        `${size}px`;

      trail.style.height =
        `${size}px`;

      // Một chút biến thiên màu
      const colors = [
        '#00aaff',
        '#00c6ff',
        '#00e5ff',
        '#58dfff',
      ];

      trail.style.setProperty(
        '--particle-color',
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ]
      );

      document.body.appendChild(trail);

      particles.add(trail);

      const timer = window.setTimeout(() => {
        trail.remove();
        particles.delete(trail);
      }, 650);

      trail.dataset.timer = timer;
    };


    // ========================================================
    // CREATE CLICK EFFECT
    // ========================================================

    const createClickEffect = (x, y) => {
      const effect =
        document.createElement('span');

      effect.className =
        'cursor-click-effect';

      effect.style.left =
        `${x}px`;

      effect.style.top =
        `${y}px`;

      document.body.appendChild(effect);

      effects.add(effect);

      const timer = window.setTimeout(() => {
        effect.remove();
        effects.delete(effect);
      }, 750);

      effect.dataset.timer = timer;
    };


    // ========================================================
    // EVENTS
    // ========================================================

    document.addEventListener(
      'mousemove',
      handleMouseMove,
      { passive: true }
    );

    document.addEventListener(
      'mouseenter',
      handleMouseEnter
    );

    document.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    document.addEventListener(
      'mousedown',
      handleMouseDown
    );

    document.addEventListener(
      'mouseup',
      handleMouseUp
    );

    document.addEventListener(
      'mouseover',
      handleMouseOver
    );

    document.addEventListener(
      'dragstart',
      handleDragStart
    );

    document.addEventListener(
      'dragend',
      handleDragEnd
    );


    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      document.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      document.removeEventListener(
        'mouseenter',
        handleMouseEnter
      );

      document.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );

      document.removeEventListener(
        'mousedown',
        handleMouseDown
      );

      document.removeEventListener(
        'mouseup',
        handleMouseUp
      );

      document.removeEventListener(
        'mouseover',
        handleMouseOver
      );

      document.removeEventListener(
        'dragstart',
        handleDragStart
      );

      document.removeEventListener(
        'dragend',
        handleDragEnd
      );

      window.removeEventListener(
        'resize',
        checkTouchDevice
      );


      // Clear particles
      particles.forEach((particle) => {
        window.clearTimeout(
          Number(particle.dataset.timer)
        );

        particle.remove();
      });

      particles.clear();


      // Clear click effects
      effects.forEach((effect) => {
        window.clearTimeout(
          Number(effect.dataset.timer)
        );

        effect.remove();
      });

      effects.clear();
    };
  }, []);


  // ==========================================================
  // CURSOR UI
  // ==========================================================

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      aria-hidden="true"
    >

      {/* Outer glow */}

      <span className="cursor-orbit" />


      {/* Main cursor arrow */}

      <svg
        className="cursor-arrow"
        viewBox="0 0 40 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="
            M4 2
            L4 38
            L14 28
            L21 44
            L27 41
            L20 25
            L35 25
            Z
          "
          fill="#00aaff"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>


      {/* Center light */}

      <span className="cursor-core" />

    </div>
  );
};


// ============================================================
// APP CONTENT
// ============================================================

const AppContent = () => {
  const location = useLocation();


  // ==========================================================
  // SUB ROOT
  // ==========================================================

  useEffect(() => {
    const root =
      document.getElementById('root');

    const isSubPage =
      location.pathname.startsWith('/web') ||
      location.pathname.startsWith('/android') ||
      location.pathname.startsWith('/app');

    if (root) {
      root.classList.toggle(
        'sub-root',
        isSubPage
      );
    }

    document.body.classList.toggle(
      'sub-root',
      isSubPage
    );


    return () => {
      if (root) {
        root.classList.remove(
          'sub-root'
        );
      }

      document.body.classList.remove(
        'sub-root'
      );
    };
  }, [location.pathname]);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <CustomCursor />

      <Header />

      <Switch>

        <Route
          path="/"
          exact
          component={HomePage}
        />

        <Route
          path="/web"
          exact
          component={Web}
        />

        <Route
          path="/app"
          exact
          component={AppComponent}
        />

        <Route
          path="/android"
          exact
          component={Android}
        />

        <Route
          path="/resume"
          exact
          component={Resume}
        />

      </Switch>

      <Footer />

      <ScrollToTopButton />
    </>
  );
};


// ============================================================
// APP
// ============================================================

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};


export default App;