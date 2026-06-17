import React, { useState, useEffect } from 'react';
import './SplitFlapLog.css'; // Import file CSS ở trên

// Component đại diện cho 1 ô duy nhất
const Flap = ({ char, isStatic = false }) => {
  const [current, setCurrent] = useState(char);
  const [flipData, setFlipData] = useState(null);

  useEffect(() => {
    // Nếu giá trị truyền vào thay đổi và không phải là text tĩnh -> Bắt đầu lật
    if (char !== current && !isStatic) {
      setFlipData({ oldChar: current, newChar: char });
      
      // Xóa thẻ animation và cập nhật số cứng sau 500ms
      const timer = setTimeout(() => {
        setCurrent(char);
        setFlipData(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [char, current, isStatic]);

  return (
    <div className={`split-flap ${isStatic ? 'static-text' : ''}`}>
      <div className="half top"><span>{current}</span></div>
      <div className="half bottom"><span>{current}</span></div>
      
      {/* Chỉ render các thẻ này trong 0.5s lúc đang lật */}
      {flipData && (
        <>
          <div className="half top flap-top"><span>{flipData.oldChar}</span></div>
          <div className="half bottom flap-bottom"><span>{flipData.newChar}</span></div>
        </>
      )}
    </div>
  );
};

// Component chính
export default function SplitFlapLog() {
  const words = ["USER", "SERVICE", "DEPLOYMENT", "REQUEST", "LOG"];
  const [counters, setCounters] = useState([995, 850, 100, 9995, 0]);

  useEffect(() => {
    // Tăng mỗi bộ đếm lên 1 đơn vị mỗi 500ms
    const interval = setInterval(() => {
      setCounters(prevCounters => prevCounters.map(c => c + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="split-flap-container">
      <div id="board">
        {words.map((word, rowIndex) => {
          // Format mảng số thành chuỗi 6 ký tự, ví dụ: "000995"
          const numStr = counters[rowIndex].toString().padStart(6, '0');
          
          return (
            <div className="row" key={`row-${rowIndex}`}>
              {/* Cột chữ cố định */}
              <div className="word-group">
                {word.split('').map((char, i) => (
                  <Flap key={`word-${rowIndex}-${i}`} char={char} isStatic={true} />
                ))}
              </div>

              {/* Cột số lật tự động */}
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
