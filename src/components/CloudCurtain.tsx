import type { CSSProperties } from 'react';

const puffIndexes = Array.from({ length: 12 }, (_, index) => index);

interface CloudCurtainProps {
  className?: string;
  panelClassName?: string;
  style?: CSSProperties;
}

export default function CloudCurtain({ className = '', panelClassName = 'cloud-curtain__panel', style }: CloudCurtainProps) {
  return (
    <div className={className} style={style}>
      <div className={`${panelClassName} ${panelClassName}--left`}>
        {puffIndexes.map((index) => (
          <span key={index} />
        ))}
      </div>
      <div className={`${panelClassName} ${panelClassName}--right`}>
        {puffIndexes.map((index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}
