import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import './RotatingText.css';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    rotationInterval = 2000,
    staggerDuration = 0.05,
    staggerFrom = 'last',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    const parts = splitBy === 'words' ? currentText.split(' ') : 
                  splitBy === 'lines' ? currentText.split('\n') : 
                  currentText.split(splitBy);
    return parts.map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      const total = totalChars;
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
      if (staggerFrom === 'random') return Math.random() * (total - 1) * staggerDuration; 
      return index * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setIsExiting(true);
      // Thời gian chờ khớp với animation rotate-out trong CSS
      setTimeout(() => {
        setCurrentTextIndex(newIndex);
        setIsExiting(false);
        if (onNext) onNext(newIndex);
      }, 400); 
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, reset: () => handleIndexChange(0) }));

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  const totalElements = elements.reduce((sum, word) => sum + word.characters.length, 0);
  let charCountIndex = 0;

  return (
    <span className={cn('text-rotate-container', mainClassName)} {...rest}>
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      <span className={cn('text-rotate-wrapper', splitBy === 'lines' ? 'text-rotate-lines' : '')} aria-hidden="true">
        {elements.map((wordObj, wordIndex) => (
          <span key={`${currentTextIndex}-${wordIndex}`} className={cn('text-rotate-word', splitLevelClassName)}>
            {wordObj.characters.map((char, charIndex) => {
              const globalIndex = charCountIndex++;
              const delay = getStaggerDelay(globalIndex, totalElements);
              return (
                <span
                  key={`${currentTextIndex}-${wordIndex}-${charIndex}`}
                  style={{ '--stagger-delay': `${delay}s` }}
                  className={cn('text-rotate-element', isExiting ? 'exit' : 'enter', elementLevelClassName)}
                >
                  {char}
                </span>
              );
            })}
            {wordObj.needsSpace && <span className="text-rotate-space">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;