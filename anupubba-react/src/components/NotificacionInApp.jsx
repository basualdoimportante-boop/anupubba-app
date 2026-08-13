// src/components/NotificacionInApp.jsx
import { useState, useEffect } from 'react';

function NotificacionInApp({ mensaje, tipo, duracion = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duracion);
    return () => clearTimeout(timer);
  }, [duracion]);

  if (!visible) return null;

  const colores = {
    exito: '#e8f5e9',
    error: '#ffebee',
    info: '#f0f7ff',
    warning: '#fff3cd'
  };

  const bordes = {
    exito: '#4caf50',
    error: '#f44336',
    info: '#6C63FF',
    warning: '#ffc107'
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '14px 20px',
      background: colores[tipo] || '#f9f9f9',
      borderRadius: '8px',
      borderLeft: `4px solid ${bordes[tipo] || '#6C63FF'}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '350px',
      animation: 'slideIn 0.3s ease'
    }}>
      <p style={{ margin: 0, fontSize: '0.95rem' }}>{mensaje}</p>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default NotificacionInApp;