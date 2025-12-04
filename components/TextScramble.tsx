import React, { useEffect, useState, useRef } from 'react';

interface TextScrambleProps {
  children: string;
  className?: string;
  trigger?: boolean;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

const TextScramble: React.FC<TextScrambleProps> = ({ children, className = '', trigger = true }) => {
  const [displayText, setDisplayText] = useState(children);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scramble = () => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        children
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return children[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= children.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    if (trigger) {
      scramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, children]);

  return (
    <span 
      className={className} 
      onMouseEnter={() => { setIsHovered(true); scramble(); }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </span>
  );
};

export default TextScramble;