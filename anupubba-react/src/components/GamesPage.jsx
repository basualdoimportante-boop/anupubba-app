import React from 'react';
import { useNavigate } from 'react-router-dom';

const GamesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🎮 Juegos</h2>
      <p>Pon a prueba tus conocimientos con estas trivias.</p>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => navigate('/trivia-neuro')}
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            marginBottom: '12px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🧠 Trivia de Neurociencias
        </button>
        <button
          onClick={() => navigate('/trivia-deportes')}
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            marginBottom: '12px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🏃 Trivia de Deportes
        </button>
        <button
          onClick={() => navigate('/trivia-caminos')}
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          🕉️ Trivia de Caminos Espirituales
        </button>
      </div>

      {/* 🔥 Botón "Volver al menú" */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '24px',
          padding: '12px',
          background: '#e2e8f0',
          color: '#4a5568',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#cbd5e0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#e2e8f0';
        }}
      >
        ← Volver al menú
      </button>
    </div>
  );
};

export default GamesPage;