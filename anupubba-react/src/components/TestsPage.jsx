import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestsPage = () => {
  const navigate = useNavigate();

  const tests = [
    {
      id: 'who5',
      nombre: 'Bienestar general',
      descripcion: 'Evalúa tu nivel de bienestar en los últimos 14 días.',
      icono: '📝'
    },
    {
      id: 'phq9',
      nombre: 'Estado de ánimo',
      descripcion: 'Cuestionario sobre síntomas depresivos en las últimas 2 semanas.',
      icono: '📝'
    },
    {
      id: 'pss10',
      nombre: 'Estrés percibido',
      descripcion: 'Mide el nivel de estrés que has sentido en el último mes.',
      icono: '📝'
    },
    {
      id: 'gad7',
      nombre: 'Ansiedad',
      descripcion: 'Evalúa síntomas de ansiedad generalizada en las últimas 2 semanas.',
      icono: '📝'
    },
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
      <h2 style={{ color: '#2d3748', fontSize: '24px', marginBottom: '4px' }}>📋 Tests de bienestar</h2>
      <p style={{ color: '#718096', marginBottom: '24px' }}>
        Elige un test para evaluar tu estado actual.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tests.map((test) => (
          <button
            key={test.id}
            onClick={() => navigate(`/tests/${test.id}`)}
            style={buttonStyle}
          >
            <span style={{ fontSize: '20px' }}>{test.icono}</span>
            <div>
              <div style={{ fontWeight: '700' }}>{test.nombre}</div>
              <div style={{ fontSize: '14px', fontWeight: '400', opacity: 0.85 }}>
                {test.descripcion}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 🔥 Botón "Ver historial" (estilo coherente) */}
      <button
        onClick={() => navigate('/history')}
        style={{
          marginTop: '16px',
          padding: '14px 20px',
          background: '#4a5568',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#2d3748';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#4a5568';
        }}
      >
        <span style={{ fontSize: '20px' }}>📊</span>
        <div>
          <div style={{ fontWeight: '700' }}>Ver historial</div>
          <div style={{ fontSize: '14px', fontWeight: '400', opacity: 0.85 }}>
            Evolución de tus tests
          </div>
        </div>
      </button>

      {/* Botón "Volver al menú" */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '12px',
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

export default TestsPage;