import React from 'react';
import { useNavigate } from 'react-router-dom';

// Esta función recibe el puntaje y el tipo de test, y devuelve la interpretación (solo para uso interno, no se muestra al usuario)
const getInterpretacion = (testId, puntaje) => {
  if (testId === 'who5') {
    if (puntaje <= 12) return 'Bienestar bajo';
    if (puntaje <= 17) return 'Bienestar moderado';
    return 'Bienestar alto';
  }
  if (testId === 'pss10') {
    if (puntaje <= 13) return 'Estrés bajo';
    if (puntaje <= 20) return 'Estrés moderado';
    if (puntaje <= 27) return 'Estrés alto';
    return 'Estrés muy alto';
  }
  if (testId === 'phq9') {
    if (puntaje <= 4) return 'Depresión mínima';
    if (puntaje <= 9) return 'Depresión leve';
    if (puntaje <= 14) return 'Depresión moderada';
    if (puntaje <= 19) return 'Depresión moderadamente severa';
    return 'Depresión severa';
  }
  if (testId === 'gad7') {
    if (puntaje <= 4) return 'Ansiedad mínima';
    if (puntaje <= 9) return 'Ansiedad leve';
    if (puntaje <= 14) return 'Ansiedad moderada';
    return 'Ansiedad severa';
  }
  return '';
};

const TestResults = ({ testId, puntaje, onClose }) => {
  const navigate = useNavigate();

  const handleVolver = () => {
    if (onClose) onClose();
    else navigate('/tests');
  };

  // No mostrar la interpretación al usuario
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
      <h2>✅ Test completado</h2>
      <p>Gracias por responder. Puedes ver la evolución de tus tests en el historial.</p>
      <button
        onClick={handleVolver}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          background: '#6C63FF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        ← Volver a tests
      </button>
    </div>
  );
};

export default TestResults;