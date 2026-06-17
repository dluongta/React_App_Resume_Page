import React, { useState, useEffect } from 'react';
import './SplitFlapLog.css'; 

const Flap = ({ char, isStatic = false }) => {
  const [current, setCurrent] = useState(char);
  const [flipData, setFlipData] = useState(null);

  useEffect(() => {
    if (char !== current && !isStatic) {
      setFlipData({ oldChar: current, newChar: char });
      
      const timer = setTimeout(() => {
        setCurrent(char);
        setFlipData(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [char, current, isStatic]);

  return (
    <div className={`split-flap ${isStatic ? 'static-text' : ''}`}>
      {/* QUAN TRỌNG: Ngay khi bắt đầu lật, tấm nền tĩnh nửa trên phải cập nhật ngay thành chữ MỚI (flipData.newChar).
        Khi tấm flap-top (chữ cũ) lật rơi xuống, nó sẽ từ từ để lộ chữ mới này ra.
      */}
      <div className="half top">
        <span>{flipData ? flipData.newChar : current}</span>
      </div>

      {/* Nửa dưới vẫn giữ chữ CŨ (current). Nó sẽ bị tấm flap-bottom che lại khi lật xong.
      */}
      <div className="half bottom">
        <span>{current}</span>
      </div>
      
      {/* Các thẻ lật 3D */}
      {flipData && (
        <>
          <div className="half top flap-top"><span>{flipData.oldChar}</span></div>
          <div className="half bottom flap-bottom"><span>{flipData.newChar}</span></div>
        </>
      )}
    </div>
  );
};

export default function SplitFlapLog( { className = "" }){
  const words = ["USER", "SERVICE", "DEPLOYMENT", "REQUEST", "LOG"];
  const [counters, setCounters] = useState([900, 850, 100, 9895, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prevCounters => prevCounters.map(c => c + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="split-flap-container ${className}">
      <div id="board">
        {words.map((word, rowIndex) => {
          const numStr = counters[rowIndex].toString().padStart(6, '0');
          
          return (
            <div className="row" key={`row-${rowIndex}`}>
              <div className="word-group">
                {word.split('').map((char, i) => (
                  <Flap key={`word-${rowIndex}-${i}`} char={char} isStatic={true} />
                ))}
              </div>

              <div className="number-group">
                {numStr.split('').map((char, i) => (
                  <Flap key={`num-${rowIndex}-${i}`} char={char} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
