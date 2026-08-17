import React, { useEffect, useRef } from 'react';

const CustomScrollbar = () => {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const dragging = useRef(false);
  const dragOffset = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;

    if (!track || !thumb) {
      return undefined;
    }

    const updateScrollbar = () => {
      const viewportHeight =
        window.innerHeight;

      const documentHeight =
        document.documentElement.scrollHeight;

      if (
        documentHeight <= viewportHeight
      ) {
        track.style.display = 'none';
        return;
      }

      track.style.display = 'block';

      const minHeight = 100;

      const thumbHeight = Math.max(
        (viewportHeight / documentHeight) *
          viewportHeight,
        minHeight
      );

      const maxThumbTop =
        viewportHeight - thumbHeight;

      const maxScroll =
        documentHeight - viewportHeight;

      const scrollProgress =
        maxScroll > 0
          ? window.scrollY / maxScroll
          : 0;

      const thumbTop =
        scrollProgress * maxThumbTop;

      thumb.style.height =
        `${thumbHeight}px`;

      thumb.style.transform =
        `translate3d(0, ${thumbTop}px, 0)`;
    };

    const handleScroll = () => {
      updateScrollbar();
    };

    const handleResize = () => {
      updateScrollbar();
    };

    const handleMouseDown = (event) => {
      if (event.target !== thumb) {
        return;
      }

      dragging.current = true;

      const rect =
        thumb.getBoundingClientRect();

      dragOffset.current =
        event.clientY - rect.top;

      document.body.classList.add(
        'custom-scrollbar-dragging'
      );

      event.preventDefault();
    };

    const handleMouseMove = (event) => {
      if (!dragging.current) {
        return;
      }

      const viewportHeight =
        window.innerHeight;

      const documentHeight =
        document.documentElement.scrollHeight;

      const thumbHeight =
        thumb.offsetHeight;

      const maxThumbTop =
        viewportHeight - thumbHeight;

      const maxScroll =
        documentHeight - viewportHeight;

      let thumbTop =
        event.clientY -
        dragOffset.current;

      thumbTop = Math.max(
        0,
        Math.min(
          thumbTop,
          maxThumbTop
        )
      );

      const progress =
        maxThumbTop > 0
          ? thumbTop / maxThumbTop
          : 0;

      window.scrollTo(
        0,
        progress * maxScroll
      );
    };

    const handleMouseUp = () => {
      dragging.current = false;

      document.body.classList.remove(
        'custom-scrollbar-dragging'
      );
    };

    const handleTrackClick = (event) => {
      if (event.target === thumb) {
        return;
      }

      const rect =
        track.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const documentHeight =
        document.documentElement.scrollHeight;

      const thumbHeight = Math.max(
        (viewportHeight / documentHeight) *
          viewportHeight,
        100
      );

      const maxThumbTop =
        viewportHeight - thumbHeight;

      const maxScroll =
        documentHeight - viewportHeight;

      let targetTop =
        event.clientY -
        rect.top -
        thumbHeight / 2;

      targetTop = Math.max(
        0,
        Math.min(
          targetTop,
          maxThumbTop
        )
      );

      const progress =
        maxThumbTop > 0
          ? targetTop / maxThumbTop
          : 0;

      window.scrollTo({
        top: progress * maxScroll,
        behavior: 'smooth',
      });
    };

    updateScrollbar();

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      handleResize
    );

    track.addEventListener(
      'click',
      handleTrackClick
    );

    thumb.addEventListener(
      'mousedown',
      handleMouseDown
    );

    document.addEventListener(
      'mousemove',
      handleMouseMove
    );

    document.addEventListener(
      'mouseup',
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );

      window.removeEventListener(
        'resize',
        handleResize
      );

      track.removeEventListener(
        'click',
        handleTrackClick
      );

      thumb.removeEventListener(
        'mousedown',
        handleMouseDown
      );

      document.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      document.removeEventListener(
        'mouseup',
        handleMouseUp
      );
    };
  }, []);

  return (
    <div
      ref={trackRef}
      id="custom-scrollbar"
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        id="custom-scrollbar-thumb"
      />
    </div>
  );
};

export default CustomScrollbar;