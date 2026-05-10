// import React, { useState } from 'react';
// import './CircularText.css';

// const CircularText = ({ 
//   text, 
//   spinDuration = 20, 
//   onHover = 'speedUp', 
//   className = '',
//   color = '#FFA500' // Mặc định màu cam
// }) => {
//   const letters = Array.from(text);
//   const [duration, setDuration] = useState(spinDuration);
//   const [isPaused, setIsPaused] = useState(false);
//   const [scale, setScale] = useState(1);

//   const handleMouseEnter = () => {
//     if (!onHover) return;

//     switch (onHover) {
//       case 'slowDown':
//         setDuration(spinDuration * 2);
//         break;
//       case 'speedUp':
//         setDuration(spinDuration / 4);
//         break;
//       case 'pause':
//         setIsPaused(true);
//         break;
//       case 'goBonkers':
//         setDuration(spinDuration / 20);
//         setScale(0.8);
//         break;
//       default:
//         setDuration(spinDuration);
//     }
//   };

//   const handleMouseLeave = () => {
//     setDuration(spinDuration);
//     setIsPaused(false);
//     setScale(1);
//   };

//   return (
//     <div
//       className={`circular-text-wrapper ${className}`}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       style={{
//         transform: `scale(${scale})`,
//         transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
//       }}
//     >
//       <div
//         className="circular-text-inner"
//         style={{
//           animation: `spin ${duration}s linear infinite`,
//           animationPlayState: isPaused ? 'paused' : 'running',
//           color: color
//         }}
//       >
//         {letters.map((letter, i) => {
//           const rotationDeg = (360 / letters.length) * i;
//           return (
//             <span
//               key={i}
//               style={{
//                 transform: `rotate(${rotationDeg}deg)`,
//               }}
//             >
//               {letter}
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CircularText;
// import React, { useState } from 'react';
// import './CircularText.css';

// const CircularText = ({ 
//   text, 
//   spinDuration = 20, 
//   onHover = 'speedUp', 
//   className = '',
//   color = '#FFA500' 
// }) => {
//   const letters = Array.from(text);
//   const [isHovered, setIsHovered] = useState(false);

//   let currentDuration = spinDuration;
//   if (isHovered) {
//     if (onHover === 'speedUp') currentDuration = spinDuration / 4;
//     if (onHover === 'slowDown') currentDuration = spinDuration * 2;
//   }

//   return (
//     <div
//       className={`circular-text-wrapper ${className}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className="circular-text-inner"
//         style={{
//           animation: `spin ${currentDuration}s linear infinite`,
//           animationPlayState: (isHovered && onHover === 'pause') ? 'paused' : 'running',
//           color: color,
//         }}
//       >
//         {letters.map((letter, i) => {
//           const rotationDeg = (360 / letters.length) * i;
//           return (
//             <span
//               key={i}
//               style={{
//                 '--angle': `${rotationDeg}deg`
//               }}
//             >
//               {letter}
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CircularText;
import React, { useState } from 'react';
import './CircularText.css';

const CircularText = ({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
  color = '#FFA500'
}) => {

  const letters = Array.from(text);
  const [hovered, setHovered] = useState(false);

  let speed = spinDuration;

  if (hovered) {
    if (onHover === 'speedUp') speed = spinDuration / 4;
    if (onHover === 'slowDown') speed = spinDuration * 2;
  }

  return (
    <div
      className={`circular-text-wrapper ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="circular-text-inner"
        style={{
          '--speed': `${speed}s`,
          '--color': color,
          animationPlayState:
            hovered && onHover === 'pause'
              ? 'paused'
              : 'running'
        }}
      >
        {letters.map((letter, i) => {

          const rotationDeg =
            (360 / letters.length) * i;

          return (
            <span
              key={i}
              style={{
                '--angle': `${rotationDeg}deg`
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CircularText;