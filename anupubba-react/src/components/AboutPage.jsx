import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 30px rgba(108, 99, 255, 0.12)' }}>
        <h1 style={{ color: '#6C63FF', fontSize: '28px', marginBottom: '8px' }}>🌅 Anupubba</h1>
        <p style={{ color: '#718096', fontSize: '16px', marginBottom: '24px' }}>
          Bienestar personal con base científica
        </p>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#2d3748', fontSize: '20px', marginBottom: '12px' }}>¿Qué es Anupubba?</h2>
          <p style={{ color: '#555', lineHeight: '1.8' }}>
            Anupubba (del sánscrito <em>"esencia del amanecer"</em>) es una herramienta de bienestar personal 
            diseñada para ayudarte a entender qué sucede en tu cerebro y cuerpo al practicar meditación, 
            distinguir evidencia sólida de creencias populares, y aplicar ese conocimiento a tu vida diaria.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#2d3748', fontSize: '20px', marginBottom: '12px' }}>¿Qué ofrece?</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0eeff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>📋</span>
              <span><strong>Tests psicométricos validados</strong> — WHO-5, PHQ-9, PSS-10, GAD-7 con control de frecuencia y mensajes éticos.</span>
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0eeff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🧠</span>
              <span><strong>Módulos educativos gamificados</strong> — Neurociencias, Deportes y Caminos Espirituales con desbloqueo progresivo.</span>
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0eeff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🪷</span>
              <span><strong>Meditaciones guiadas</strong> — Reproductor de audio con 9 meditaciones alojadas en Cloudinary.</span>
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f0eeff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🗺️</span>
              <span><strong>Mapa Consciente colaborativo</strong> — Geolocalización, filtros y etiquetas para encontrar espacios de bienestar.</span>
            </li>
            <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🎮</span>
              <span><strong>Juegos</strong> — Trivias generales de Neurociencias, Deportes y Caminos Espirituales.</span>
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#2d3748', fontSize: '20px', marginBottom: '12px' }}>Nuestros principios</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#6C63FF', fontSize: '20px' }}>🧪</span>
              <span>Basado en <strong>evidencia científica</strong></span>
            </li>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#6C63FF', fontSize: '20px' }}>🔒</span>
              <span><strong>Privacidad y anonimización</strong> de datos</span>
            </li>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#6C63FF', fontSize: '20px' }}>💰</span>
              <span><strong>Gratuito</strong> con donaciones voluntarias</span>
            </li>
            <li style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#6C63FF', fontSize: '20px' }}>🧘</span>
              <span>Enfoque en el <strong>autocuidado y el bienestar</strong></span>
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#2d3748', fontSize: '20px', marginBottom: '12px' }}>📋 Política de privacidad</h2>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px' }}>
            En Anupubba nos tomamos tu privacidad en serio. Todos los datos que compartes son 
            <strong> anonimizados</strong> (tu identidad se guarda como un hash) y <strong>no se comparten</strong> 
            con terceros. Puedes solicitar la eliminación de tus datos en cualquier momento.
          </p>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '14px', marginTop: '8px' }}>
            <strong>Tu consentimiento:</strong> Al registrarte, aceptas que tus datos sean utilizados 
            exclusivamente para generar tus reportes personales y mejorar la plataforma. 
            <strong> No compartimos tu información con ninguna entidad externa.</strong>
          </p>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
            📧 Para consultas o solicitudes de eliminación de datos: <strong>anupubba@gmail.com</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 24px',
              background: '#6C63FF',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
            }}
          >
            ← Volver al menú
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#6C63FF',
              border: '2px solid #6C63FF',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            🏠 Ir a inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;