import React from 'react';
import { useNavigate } from 'react-router-dom';

const GamesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#6C63FF' }}>🎮 Juegos</h2>
      <p style={{ color: '#555' }}>Pon a prueba tus conocimientos con estas trivias.</p>
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
            borderRadius: '12px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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
            borderRadius: '12px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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
            borderRadius: '12px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          🕉️ Trivia de Caminos Espirituales
        </button>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: 'transparent',
          color: '#6C63FF',
          border: '2px solid #6C63FF',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        ← Volver
      </button>
    </div>
  );
};

export default GamesPage;