import React, { useEffect, useRef } from 'react';
import './ScrollRevealText.css';

export const ScrollRevealText = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight;

      // Scroll progress CHỈ trong section
      const progress =
        ((windowHeight - rect.top) / (sectionHeight - windowHeight)) * 100 - 155;

      const clamped = Math.min(Math.max(progress, 0), 100) * 1.5;

      textRef.current.style.setProperty(
        '--scroll-pos',
        `${clamped}%`
      );
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="scroll-text-section">
      <div className="sticky-wrapper">
        <div ref={textRef} className="reveal-text">
          PROFICIENT PROGRAMMER <br />
          SOFTWARE DEVELOPER <br />
          HARDWARE ENGINEER
        </div>
      </div>
    </section>
  );
};
