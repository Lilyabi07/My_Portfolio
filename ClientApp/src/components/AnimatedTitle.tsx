import React, { useState, useEffect } from 'react';
import './AnimatedTitle.css';

type AnimationType = 'typing' | 'wave' | 'fadeRise' | 'glitch' | 'scalePop' | 'blur';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  animationType?: AnimationType;
  speed?: number;
  delay?: number;
}

function AnimatedTitle({ 
  text, 
  className = '', 
  animationType = 'typing',
  speed = 80,
  delay = 300
}: AnimatedTitleProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Typing effect (original)
  if (animationType === 'typing') {
    return <TypingEffect text={text} className={className} speed={speed} />;
  }

  // Wave bounce effect
  if (animationType === 'wave') {
    return (
      <span className={`${className} animated-title-wave`}>
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`wave-char ${isAnimating ? 'animate' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  }

  // Fade and rise effect
  if (animationType === 'fadeRise') {
    return (
      <span className={`${className} animated-title-fade-rise`}>
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`fade-rise-char ${isAnimating ? 'animate' : ''}`}
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  }

  // Glitch effect
  if (animationType === 'glitch') {
    return (
      <span className={`${className} animated-title-glitch ${isAnimating ? 'animate' : ''}`}>
        <span className="glitch-text" data-text={text}>
          {text}
        </span>
      </span>
    );
  }

  // Scale pop effect
  if (animationType === 'scalePop') {
    return (
      <span className={`${className} animated-title-scale-pop`}>
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`scale-pop-char ${isAnimating ? 'animate' : ''}`}
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  }

  // Blur to focus effect
  if (animationType === 'blur') {
    return (
      <span className={`${className} animated-title-blur ${isAnimating ? 'animate' : ''}`}>
        {text}
      </span>
    );
  }

  return <span className={className}>{text}</span>;
}

// Helper component for typing effect
function TypingEffect({ text, className, speed }: { text: string; className: string; speed: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayedText('');
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && text.length > 0) {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="typing-cursor">|</span>}
    </span>
  );
}

export default AnimatedTitle;
