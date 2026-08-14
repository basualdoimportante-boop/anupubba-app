import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 8px 30px rgba(108, 99, 255, 0.12)',
    }}>
      <h1 style={{ color: '#6C63FF', fontSize: '36px', marginBottom: '8px' }}>
        🌅 Anupubba
      </h1>
      <p style={{ fontSize: '18px', color: '#555', marginBottom: '24px' }}>
        Bienestar personal con base científica
      </p>

      <div style={{
        textAlign: 'left',
        background: '#f9f9ff',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px',
        border: '1px solid #f0eeff',
      }}>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', margin: 0 }}>
          <strong>Anupubba</strong> es una herramienta de bienestar personal diseñada para ayudarte a:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📋</span> Realizar tests psicométricos validados
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🧠</span> Aprender sobre tu cerebro y tu cuerpo
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🪷</span> Practicar meditaciones guiadas
          </li>
          <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🗺️</span> Conectar con una comunidad consciente
          </li>
        </ul>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '16px', fontStyle: 'italic' }}>
          Todo sin costo, con total privacidad y basado en evidencia científica.
        </p>
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: '14px 48px',
          background: '#6C63FF',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(108, 99, 255, 0.35)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Comenzar →
      </button>
    </div>
  );
};

export default Onboarding;