import type { CSSProperties } from 'react';
import './CloudCurtain.css';

interface CloudCurtainProps {
  className?: string;
  style?: CSSProperties;
}

export default function CloudCurtain({ className = '', style }: CloudCurtainProps) {
  return (
    <div className={`cloud-curtain ${className}`} style={style} aria-hidden="true">
      <div className="cloud-curtain__veil" />
      <div className="cloud-curtain__mist cloud-curtain__mist--far" />
      <div className="cloud-curtain__mist cloud-curtain__mist--middle" />
      <div className="cloud-curtain__mist cloud-curtain__mist--near" />
    </div>
  );
}
