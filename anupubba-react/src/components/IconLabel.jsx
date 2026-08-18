import React from 'react';
import { theme } from '../theme';

const IconLabel = ({ icon: Icon, label, iconSize = 20, gap = theme.space[2] }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: gap,
        fontFamily: theme.font.family,
        fontSize: theme.font.size.base,
        color: theme.colors.textPrimary,
      }}
    >
      <Icon size={iconSize} />
      <span>{label}</span>
    </span>
  );
};

export default IconLabel;