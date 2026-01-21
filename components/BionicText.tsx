
import React from 'react';

interface BionicTextProps {
  text: string;
  enabled: boolean;
  className?: string;
}

const BionicText: React.FC<BionicTextProps> = ({ text, enabled, className = "" }) => {
  if (!enabled) return <span className={className}>{text}</span>;

  const words = text.split(/\s+/);
  
  return (
    <span className={className}>
      {words.map((word, i) => {
        if (!word) return null;
        
        // Bionic Reading logic: bold the first half of the word (rounded up)
        const mid = Math.ceil(word.length / 2);
        const start = word.slice(0, mid);
        const rest = word.slice(mid);
        
        return (
          <React.Fragment key={i}>
            <span className="font-extrabold text-white">{start}</span>
            <span className="opacity-70">{rest}</span>
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export default BionicText;
