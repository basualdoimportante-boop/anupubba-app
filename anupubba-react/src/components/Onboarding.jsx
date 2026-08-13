import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Si ya está logueado, redirige al dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSelect = (option) => {
    setSelected(option);
    localStorage.setItem('onboardingPreference', option);
    navigate('/login');
  };

  const options = [
    { id: 'bienestar', label: '🌿 Bienestar personal', desc: 'Quiero mejorar mi salud mental y física.' },
    { id: 'aprender', label: '📚 Aprender', desc: 'Quiero entender cómo funciona mi cerebro y mi cuerpo.' },
    { id: 'comunidad', label: '🤝 Comunidad', desc: 'Quiero conectar con otros y compartir experiencias.' },
    { id: 'explorar', label: '🧭 Explorar', desc: 'Quiero descubrir nuevas prácticas y filosofías.' },
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#6C63FF' }}>🌅 Anupubba</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>¿Qué resuena contigo hoy?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: selected === opt.id ? '3px solid #6C63FF' : '1px solid #ddd',
              background: selected === opt.id ? '#f0eeff' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{opt.label}</div>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>{opt.desc}</div>
          </button>
        ))}
      </div>
      <p style={{ marginTop: '30px', fontSize: '14px', color: '#888' }}>
        Al continuar, aceptas nuestra política de privacidad.
      </p>
    </div>
  );
};

export default Onboarding;