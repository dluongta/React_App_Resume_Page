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
        </defs>

        {/* THÊM VÒNG TRÒN NỀN MÀU CAM Ở ĐÂY */}
        <circle 
          cx="250" 
          cy="250" 
          r="215" 
          fill="transparent" 
          stroke="#ff5a00" /* Màu cam */
          strokeWidth="38" /* Độ dày của dải màu cam (bọc vừa chữ 24px) */
        />

        {/* THÊM dominantBaseline="middle" ĐỂ CHỮ NẰM CHÍNH GIỮA DẢI CAM */}
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