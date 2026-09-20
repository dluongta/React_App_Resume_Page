import React from 'react';
import './CircularText.css';

const ResponsiveCircularText = ({ text }) => {

  const circleCircumference = 2 * Math.PI * 90;

  return (
    <div className="circular-text-container">
      <svg
        viewBox="0 0 200 200"
        className="circular-text-svg"
      >
        <defs>
          <path
            id="seamlessTextPath"
            d="
              M 100, 10
              a 90,90 0 1,1 0,180
              a 90,90 0 1,1 0,-180
            "
          />
        </defs>
        
        <text 
          fontSize="14" 
          fontWeight="bold" 
          fill="orange"
        >
          <textPath 
            href="#seamlessTextPath" 
            startOffset="0%"
            textLength={circleCircumference} 
            lengthAdjust="spacing"
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default ResponsiveCircularText;