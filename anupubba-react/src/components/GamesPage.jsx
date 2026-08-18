import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Button from './Button';

const GamesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '600px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xxl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>🎮 Juegos</h2>
      <p style={{ color: theme.colors.textSecondary, marginBottom: theme.space[6] }}>Pon a prueba tus conocimientos con estas trivias.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[3] }}>
        <Button onClick={() => navigate('/trivia-neuro')}>🧠 Trivia de Neurociencias</Button>
        <Button onClick={() => navigate('/trivia-deportes')}>🏃 Trivia de Deportes</Button>
        <Button onClick={() => navigate('/trivia-caminos')}>🕉️ Trivia de Caminos Espirituales</Button>
      </div>

      <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: theme.space[4] }}>← Volver al menú</Button>
    </div>
  );
};

export default GamesPage;