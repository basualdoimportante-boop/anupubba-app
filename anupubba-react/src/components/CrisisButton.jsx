import React from 'react';
import { HeartHandshake } from 'lucide-react';

const CrisisButton = ({ onClick, className = '', style = {} }) => {
  return (
    <button
      className={`btn-crisis ${className}`}
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'center',
        ...style,
      }}
    >
      <HeartHandshake size={20} />
      Hablar con alguien ahora
    </button>
  );
};

export default CrisisButton;