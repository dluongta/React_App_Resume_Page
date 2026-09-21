import React from "react";
import "./CircularText.css";

const CircularText = ({
  // Dùng \u00A0 thay cho dấu cách để trình duyệt không xóa mất khoảng trắng
  text = "REACT APP RESUME PAGE\u00A0\u00A0✦\u00A0\u00A0PORTFOLIO WEBSITE\u00A0\u00A0✦\u00A0\u00A0DLUONGTA TSCEND\u00A0\u00A0✦\u00A0\u00A0",
}) => {
  const radius = 215;
  const pathLength = 2 * Math.PI * radius;

  return (
    <div className="circular-text-wrapper">
      <svg
        className="circular-text-svg"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="circularTextPath"
            d="
              M 250 250
              m -215 0
              a 215 215 0 1 1 430 0
              a 215 215 0 1 1 -430 0
            "
            fill="none"
          />
          {/* Định nghĩa Linear Gradient theo góc 90deg tương ứng với CSS */}
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff5a00" />
            <stop offset="50%" stopColor="#ff1493" />
            <stop offset="100%" stopColor="#7b2cff" />
          </linearGradient>
        </defs>

        {/* Vòng tròn sử dụng gradient đã định nghĩa */}
        <circle 
          cx="250" 
          cy="250" 
          r="215" 
          fill="transparent" 
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