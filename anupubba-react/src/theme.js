// src/theme.js
export const theme = {
  colors: {
    bg: '#FAF6F0',
    surface: '#FFFFFF',
    textPrimary: '#3A342E',
    textSecondary: '#6B6259',

    accentPrimary: '#D97F4E',   // ámbar amanecer — SOLO para el CTA principal
    accentSecondary: '#9B8AC4', // lavanda tenue — decorativo/secundario
    accentCalm: '#7FA88F',      // verde salvia desaturado — estados positivos

    crisis: '#3D7B82',          // EXCLUSIVO para CrisisButton
    crisisText: '#FFFFFF',

    scale: ['#FDF6ED', '#F5DFC0', '#F0C48A', '#D97F4E'], // escala para franjas
  },
  font: {
    family: "'Nunito', system-ui, -apple-system, sans-serif",
    size: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, xxl: 24, xxxl: 30, xxxxl: 36 },
    lineHeight: { body: 1.6, heading: 1.25 },
    weight: { body: 400, emphasis: 600 },
  },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 },
  radius: { card: 16, button: 12, pill: 9999 },
  shadow: { card: '0 2px 8px rgba(58, 52, 46, 0.08)' },
  touch: { min: 44, playerControls: 60 },
  breakpoint: { tablet: 640, desktop: 1024 },
};