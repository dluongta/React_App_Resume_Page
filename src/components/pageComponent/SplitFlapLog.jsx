import React, { useState, useEffect } from 'react';
import './SplitFlapLog.css'; 

const Flap = ({ char, isStatic = false }) => {
    const [prevChar, setPrevChar] = useState(char);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (char !== prevChar && !isStatic) {
            setIsFlipping(true);
            
            const timer = setTimeout(() => {
                setPrevChar(char);
                setIsFlipping(false);
            }, 450);

            return () => clearTimeout(timer);
        }
    }, [char, prevChar, isStatic]);

    return (
        <div className={`split-flap ${isStatic ? 'static-text' : ''}`}>
            
            <div className="half top">
                <span>{isFlipping ? char : prevChar}</span>
            </div>

            <div className="half bottom">
                <span>{prevChar}</span>
            </div>
            
            {isFlipping && (
                <>
                    <div className="half top flap-top">
                        <span>{prevChar}</span> 
                    </div>
                    <div className="half bottom flap-bottom">
                        <span>{char}</span>   
                    </div>
                </>
            )}
        </div>
    );
};

export default function SplitFlapLog({ className = "" }) {
    const words = ["USER", "SERVICE", "DEPLOYMENT", "REQUEST", "LOG"];
    const [counters, setCounters] = useState([2000, 2000, 2000, 2000, 2000]);

    useEffect(() => {
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