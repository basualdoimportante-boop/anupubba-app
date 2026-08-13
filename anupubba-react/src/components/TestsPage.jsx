import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestsPage = () => {
  const navigate = useNavigate();

  // Lista de tests con nombres coloquiales
  const tests = [
    { id: 'who5', nombre: 'Bienestar general', descripcion: 'Evalúa tu nivel de bienestar en los últimos 14 días.' },
    { id: 'phq9', nombre: 'Estado de ánimo', descripcion: 'Cuestionario sobre síntomas depresivos en las últimas 2 semanas.' },
    { id: 'pss10', nombre: 'Estrés percibido', descripcion: 'Mide el nivel de estrés que has sentido en el último mes.' },
    { id: 'gad7', nombre: 'Ansiedad', descripcion: 'Evalúa síntomas de ansiedad generalizada en las últimas 2 semanas.' },
  ];

  const buttonStyle = {
    padding: '14px 20px',
    background: '#6C63FF',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>📋 Tests de bienestar</h2>
      <p style={{ color: '#555', marginBottom: '24px' }}>
        Elige un test para evaluar tu estado actual.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tests.map((test) => (
          <button
            key={test.id}
            onClick={() => navigate(`/tests/${test.id}`)}
            style={buttonStyle}
          >
            <span style={{ fontSize: '20px' }}>📝</span>
            <div>
              <div style={{ fontWeight: '700' }}>{test.nombre}</div>
              <div style={{ fontSize: '14px', fontWeight: '400', opacity: 0.8 }}>
                {test.descripcion}
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '24px',
          padding: '12px',
          background: '#888',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '16px',
        }}
      >
        ← Volver al Dashboard
      </button>
    </div>
  );
};

export default TestsPage;