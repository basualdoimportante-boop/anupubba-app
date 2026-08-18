import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Button from './Button';
import Card from './Card';
import IconLabel from './IconLabel';
import { ClipboardList } from 'lucide-react';

const TestsPage = () => {
  const navigate = useNavigate();

  const tests = [
    {
      id: 'who5',
      nombre: 'Bienestar general',
      descripcion: 'Evalúa tu nivel de bienestar en los últimos 14 días.',
      icono: '📝',
    },
    {
      id: 'phq9',
      nombre: 'Estado de ánimo',
      descripcion: 'Cuestionario sobre síntomas depresivos en las últimas 2 semanas.',
      icono: '📝',
    },
    {
      id: 'pss10',
      nombre: 'Estrés percibido',
      descripcion: 'Mide el nivel de estrés que has sentido en el último mes.',
      icono: '📝',
    },
    {
      id: 'gad7',
      nombre: 'Ansiedad',
      descripcion: 'Evalúa síntomas de ansiedad generalizada en las últimas 2 semanas.',
      icono: '📝',
    },
  ];

  const pageStyle = {
    maxWidth: '600px',
    margin: `${theme.space[8]} auto`,
    padding: theme.space[4],
  };

  const titleStyle = {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.xxl,
    fontWeight: theme.font.weight.emphasis,
    marginBottom: theme.space[1],
  };

  const subtitleStyle = {
    color: theme.colors.textSecondary,
    marginBottom: theme.space[6],
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space[3],
  };

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>📋 Tests de bienestar</h2>
      <p style={subtitleStyle}>Elige un test para evaluar tu estado actual.</p>

      <div style={buttonContainerStyle}>
        {tests.map((test) => (
          <Button key={test.id} onClick={() => navigate(`/tests/${test.id}`)}>
            <span style={{ fontSize: '20px' }}>{test.icono}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>{test.nombre}</div>
              <div style={{ fontSize: '14px', fontWeight: 400, opacity: 0.85 }}>
                {test.descripcion}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div style={{ marginTop: theme.space[4] }}>
        <Button onClick={() => navigate('/history')}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700 }}>Ver historial</div>
            <div style={{ fontSize: '14px', fontWeight: 400, opacity: 0.85 }}>
              Evolución de tus tests
            </div>
          </div>
        </Button>
      </div>

      <div style={{ marginTop: theme.space[3] }}>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Volver al menú
        </Button>
      </div>
    </div>
  );
};

export default TestsPage;