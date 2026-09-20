import React, { useState, useRef, useCallback } from 'react';

interface InteractiveHeadlineProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  id?: string;
}

export const InteractiveHeadline: React.FC<InteractiveHeadlineProps> = ({
  children,
  className = '',
  as: Component = 'h2',
  id,
}) => {
  // If children is not a simple string, we can process text nodes or fallback
  if (typeof children !== 'string') {
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  return (
    <Component id={id} className={`interactive-heading-container ${className}`}>
      <InteractiveText text={children} />
    </Component>
  );
};

interface InteractiveTextProps {
  text: string;
  className?: string;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ text, className = '' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Split into words to preserve word-breaking and inline layout
  const words = text.split(' ');
  let globalCharIndex = 0;

  const handlePointerLeave = useCallback(() => {
    setHoveredIdx(null);
    setActiveIdx(null);
  }, []);

  return (
    <span
      ref={containerRef}
      onPointerLeave={handlePointerLeave}
      className={`inline ${className}`}
      style={{ WebkitFontSmoothing: 'antialiased' }}
    >
      {words.map((word, wordIdx) => {
        const letters = Array.from(word);
        const wordElement = (
          <span key={`word-${wordIdx}`} className="inline-block whitespace-nowrap">
            {letters.map((char) => {
              const charIdx = globalCharIndex++;
              const isDirect = hoveredIdx === charIdx;
              const isNeighbor1 = hoveredIdx !== null && Math.abs(hoveredIdx - charIdx) === 1;
              const isNeighbor2 = hoveredIdx !== null && Math.abs(hoveredIdx - charIdx) === 2;
              const isPressed = activeIdx === charIdx;

              let letterClass = 'letter-interactive inline-block transition-all select-none cursor-default';
              let transformStyle = '';

              if (isPressed) {
                transformStyle = 'translateY(1px) scale(0.97)';
              } else if (isDirect) {
                transformStyle = 'translateY(-5px) scale(1.08)';
                letterClass += ' text-[#115E59] font-medium letter-floating';
              } else if (isNeighbor1) {
                transformStyle = 'translateY(-2.5px) scale(1.04)';
              } else if (isNeighbor2) {
                transformStyle = 'translateY(-1px) scale(1.015)';
              }

              return (
                <span
                  key={`char-${charIdx}`}
                  onPointerEnter={() => setHoveredIdx(charIdx)}
                  onPointerDown={() => setActiveIdx(charIdx)}
                  onPointerUp={() => setActiveIdx(null)}
                  className={letterClass}
                  style={{
                    transform: transformStyle || undefined,
                    transitionDuration: isDirect ? '200ms' : '280ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    willChange: 'transform',
                  }}
                  aria-hidden="true"
                >
                  {char}
                </span>
              );
            })}
          </span>
        );

        // Add trailing space between words (except last word)
        if (wordIdx < words.length - 1) {
          globalCharIndex++; // account for space
          return (
            <React.Fragment key={`frag-${wordIdx}`}>
              {wordElement}
              <span className="inline-block w-[0.27em]">&nbsp;</span>
            </React.Fragment>
          );
        }

        return wordElement;
      })}
      {/* Screen reader accessible plain text */}
      <span className="sr-only">{text}</span>
    </span>
  );
};
