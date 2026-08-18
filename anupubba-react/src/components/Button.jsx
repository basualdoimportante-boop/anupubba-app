import React from 'react';

const Button = ({
  variant = 'primary',
  children,
  onClick,
  className = '',
  style = {},
  disabled = false,
  ...props
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  const baseStyle = {
    width: '100%',
    textAlign: 'center',
  };

  return (
    <button
      className={`${baseClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;