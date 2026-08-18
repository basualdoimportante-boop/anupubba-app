import React from 'react';
import { theme } from '../theme';

const Card = ({ children, style = {}, className = '' }) => {
  const cardStyle = {
    background: theme.colors.surface,
    borderRadius: theme.radius.card,
    boxShadow: theme.shadow.card,
    padding: theme.space[6],
    ...style,
  };

  return (
    <div className={className} style={cardStyle}>
      {children}
    </div>
  );
};

export default Card;