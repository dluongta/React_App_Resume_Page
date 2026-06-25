import { useEffect, useRef, memo } from 'react';
import './DotField.css';

const TWO_PI = Math.PI * 2;

const DotField = memo(
  ({
    dotRadius = 2,
    dotSpacing = 18,
    cursorRadius = 300,
    bulgeStrength = 50,
    gradientFrom = '#A855F7',
    gradientTo = '#A855F7',
  }) => {
    const canvasRef = useRef(null);
    const dotsRef = useRef([]);
    const mouseRef = useRef({
      x: -9999,
      y: -9999,
    });

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const resize = () => {
        const parent = canvas.parentElement;

        // canvas.width = parent.offsetWidth;
        // canvas.height = parent.offsetHeight;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = parent.offsetWidth * dpr;
        canvas.height = parent.offsetHeight * dpr;

        canvas.style.width = `${parent.offsetWidth}px`;
        canvas.style.height = `${parent.offsetHeight}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildDots();
      };

      const buildDots = () => {
        const dots = [];

        const step =
          dotSpacing + dotRadius * 2;

        for (
          let y = step;
          y < canvas.height;
          y += step
        ) {
          for (
            let x = step;
            x < canvas.width;
            x += step
          ) {
            dots.push({
              ax: x,
              ay: y,
              x,
              y,
            });
          }
        }

        dotsRef.current = dots;
      };

      const onMove = (e) => {
        const rect =
          canvas.getBoundingClientRect();

        mouseRef.current.x =
          e.clientX - rect.left;

        mouseRef.current.y =
          e.clientY - rect.top;
      };

      const animate = () => {
        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const gradient =
          ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
          );

        gradient.addColorStop(
          0,
          gradientFrom
        );

        gradient.addColorStop(
          1,
          gradientTo
        );

        ctx.fillStyle = gradient;

        dotsRef.current.forEach((dot) => {
          const dx =
            mouseRef.current.x - dot.ax;

          const dy =
            mouseRef.current.y - dot.ay;

          const dist =
            Math.sqrt(
              dx * dx + dy * dy
            );

          let x = dot.ax;
          let y = dot.ay;

          if (dist < cursorRadius) {
            const force =
              (1 -
                dist /
                cursorRadius) *
              bulgeStrength;

            const angle =
              Math.atan2(dy, dx);

            x =
              dot.ax -
              Math.cos(angle) *
              force;

            y =
              dot.ay -
              Math.sin(angle) *
              force;
          }

          ctx.beginPath();
          ctx.arc(
            x,
            y,
            dotRadius,
            0,
            TWO_PI
          );
          ctx.fill();
        });

        requestAnimationFrame(
          animate
        );
      };

      resize();
      animate();

      window.addEventListener(
        'resize',
        resize
      );

      window.addEventListener(
        'mousemove',
        onMove
      );

      return () => {
        window.removeEventListener(
          'resize',
          resize
        );

        window.removeEventListener(
          'mousemove',
          onMove
        );
      };
    }, [
      dotRadius,
      dotSpacing,
      cursorRadius,
      bulgeStrength,
      gradientFrom,
      gradientTo,
    ]);

    return (
      <div className="dot-field-container">
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

export default DotField;