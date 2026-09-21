import React from "react";
import "./CircularText.css";

const CircularText = ({
  text = "REACT APP RESUME PAGE\u00A0✦\u00A0PORTFOLIO WEBSITE\u00A0✦\u00A0DLUONGTA TSCEND\u00A0✦\u00A0",
}) => {
  const radius = 180;
  const pathLength = 2 * Math.PI * radius;

  return (
    <div className="circular-text-wrapper">
      <svg
        className="circular-text-svg"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="circularTextPath"
            d="
              M 200 200 
              m -180 0
              a 180 180 0 1 1 360 0
              a 180 180 0 1 1 -360 0
            "
            fill="none"
          />
          {/* Dải màu gradient bạn đã định nghĩa */}
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5a00" />
            <stop offset="50%" stopColor="#ff1493" />
            <stop offset="100%" stopColor="#7b2cff" />
          </linearGradient>
        </defs>

        <circle
          cx="200"
          cy="200"
          r="180"
          fill="transparent"
          // stroke="url(#circleGradient)" 
          stroke="#ff5a00"
          strokeWidth="38"
        />

        <text
          className="circular-text"
          xmlSpace="preserve"
          dominantBaseline="middle"
        >
          <textPath
            href="#circularTextPath"
            startOffset="0%"
            textLength={pathLength}
            lengthAdjust="spacing"
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CircularText;