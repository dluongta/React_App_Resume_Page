import React, { useState, useEffect } from 'react';
import './SplitFlapLog.css'; // Import file CSS

// Component con xử lý 1 ô (Lật số chính xác như Vanilla JS)
const Flap = ({ char, isStatic = false }) => {
    const [prevChar, setPrevChar] = useState(char);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        // Nếu nhận được số mới -> Kích hoạt lật
        if (char !== prevChar && !isStatic) {
            setIsFlipping(true);
            
            // Đặt timeout 450ms (ngắn hơn 500ms của interval) để kịp dọn dẹp trước nhịp lật tiếp theo
            const timer = setTimeout(() => {
                setPrevChar(char);
                setIsFlipping(false);
            }, 450);

            return () => clearTimeout(timer);
        }
    }, [char, prevChar, isStatic]);

    return (
        <div className={`split-flap ${isStatic ? 'static-text' : ''}`}>
            
            {/* 1. Nửa trên: Nếu đang lật thì hiện luôn số MỚI (để khi tấm flap rơi xuống sẽ lộ ra). Ngược lại hiện bình thường. */}
            <div className="half top">
                <span>{isFlipping ? char : prevChar}</span>
            </div>

            {/* 2. Nửa dưới: Luôn hiện số CŨ cho đến khi animation kết thúc (isFlipping = false) thì mới update */}
            <div className="half bottom">
                <span>{prevChar}</span>
            </div>
            
            {/* 3. Render tấm lật (Chỉ xuất hiện khi số thay đổi) */}
            {isFlipping && (
                <>
                    <div className="half top flap-top">
                        <span>{prevChar}</span> {/* Rơi tấm mang số CŨ xuống */}
                    </div>
                    <div className="half bottom flap-bottom">
                        <span>{char}</span>    {/* Đập tấm mang số MỚI xuống nửa dưới */}
                    </div>
                </>
            )}
        </div>
    );
};

// Component chính bao ngoài
export default function SplitFlapLog({ className = "" }) {
    const words = ["USER", "SERVICE", "DEPLOYMENT", "REQUEST", "LOG"];
    const [counters, setCounters] = useState([999, 999, 999, 999, 999]);

    useEffect(() => {
        // Tăng số mỗi 0.5 giây
        const interval = setInterval(() => {
            setCounters(prev => prev.map(c => c + 1));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`split-flap-wrapper ${className}`}>
            <div id="board">
                {words.map((word, rowIndex) => {
                    const numStr = counters[rowIndex].toString().padStart(6, '0');
                    
                    return (
                        <div className="row" key={`row-${rowIndex}`}>
                            
                            {/* Nhóm chữ tĩnh */}
                            <div className="word-group">
                                {word.split('').map((char, i) => (
                                    <Flap key={`word-${rowIndex}-${i}`} char={char} isStatic={true} />
                                ))}
                            </div>

                            {/* Nhóm số động */}
                            <div className="number-group">
                                {numStr.split('').map((char, i) => (
                                    // Truyền trực tiếp ký tự mới vào, component Flap sẽ tự so sánh và lật
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