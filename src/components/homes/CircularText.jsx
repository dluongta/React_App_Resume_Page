import React from "react";
import "./CircularText.css";

const CircularText = ({
  text = "REACT APP RESUME PAGE\u00A0✦\u00A0PORTFOLIO WEBSITE\u00A0✦\u00A0DLUONGTA TSCEND\u00A0✦\u00A0",
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

        <text className="circular-text" xmlSpace="preserve">
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