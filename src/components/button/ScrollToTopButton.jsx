// import React, { useEffect, useState } from 'react';
// import './ScrollToTopButton.css';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// const ScrollToTopButton = () => {
//   // const [visible, setVisible] = useState(false);
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     const toggleVisible = () => {
//       const scrolled = document.documentElement.scrollTop;
//       // setVisible(scrolled > 300);
//       setVisible(true);
//     };

//     window.addEventListener('scroll', toggleVisible);
//     return () => window.removeEventListener('scroll', toggleVisible);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   return (
//     <div 
//       className="btn-pulse-wrapper scroll-wrapper" 
//       style={{ display: visible ? 'inline-block' : 'none' }}
//     >
//       <span className="pulse-third"></span>
//       <button className="scroll-to-top" onClick={scrollToTop}>
//         <ArrowUpwardIcon style={{ fontSize: '32px', position: 'relative', zIndex: 10 }} />
//       </button>
//     </div>
//   );
// };

// export default ScrollToTopButton;
import React, { useEffect, useState } from 'react';
import './ScrollToTopButton.css';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ScrollToTopButton = () => {
  // const [visible, setVisible] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      // setVisible(scrolled > 300);
      setVisible(true);
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className="scroll-to-top"
      onClick={scrollToTop}
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <ArrowUpwardIcon style={{ fontSize: '32px' }} />
    </button>
  );
};

export default ScrollToTopButton;