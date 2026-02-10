import React, { useState, useEffect } from 'react';
import './TitleReveal.css';

interface TitleRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

function TitleReveal({ text, className = '', delay = 300 }: TitleRevealProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className={`title-reveal-wrapper ${className}`}>
      <span className={`title-reveal-text ${isAnimating ? 'animate' : ''}`}>
        {text}
      </span>
      <span className={`title-reveal-underline ${isAnimating ? 'animate' : ''}`}></span>
    </span>
  );
}

export default TitleReveal;
