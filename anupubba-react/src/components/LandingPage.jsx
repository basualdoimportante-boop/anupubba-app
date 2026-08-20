import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Button from './Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const APP_URL = 'https://anupubba-bienestar.web.app';
  const DONACION_URL = 'https://mpago.la/1REi7T2';

  const handleDescargar = () => {
    navigate('/');
  };

  const handleDonacion = () => {
    window.open(DONACION_URL, '_blank', 'noopener,noreferrer');
  };

  const pageStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.space[4],
    minHeight: '100vh',
    background: theme.colors.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle = {
    background: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.space[6],
    boxShadow: theme.shadow.card,
    width: '100%',
    textAlign: 'center',
  };

  const titleStyle = {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.xxxxl,
    fontWeight: theme.font.weight.emphasis,
    marginBottom: theme.space[2],
  };

  const subtitleStyle = {
    color: theme.colors.textSecondary,
    fontSize: theme.font.size.lg,
    marginBottom: theme.space[6],
  };

  const descriptionStyle = {
    textAlign: 'left',
    fontSize: theme.font.size.base,
    lineHeight: theme.font.lineHeight.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.space[6],
  };

  const qrContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.space[6],
    padding: theme.space[4],
    background: 'white',
    borderRadius: theme.radius.card,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  const buttonGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space[3],
    width: '100%',
    marginTop: theme.space[4],
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🌅 Anupubba</h1>
        <p style={subtitleStyle}>Bienestar personal con base científica</p>

        <div style={descriptionStyle}>
          <p><strong>Anupubba</strong> (del sánscrito <em>"esencia del amanecer"</em>) es una herramienta gratuita de bienestar personal diseñada para ayudarte a entender qué sucede en tu cerebro y cuerpo al practicar meditación, distinguir evidencia sólida de creencias populares, y aplicar ese conocimiento a tu vida diaria.</p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: theme.space[3] }}>
            <li style={{ padding: theme.space[2], borderBottom: '1px solid #f0eeff' }}>📋 Tests psicométricos validados (WHO-5, PHQ-9, PSS-10, GAD-7)</li>
            <li style={{ padding: theme.space[2], borderBottom: '1px solid #f0eeff' }}>🧠 Módulos educativos gamificados (Neurociencias, Deportes, Caminos Espirituales)</li>
            <li style={{ padding: theme.space[2], borderBottom: '1px solid #f0eeff' }}>🪷 Meditaciones guiadas con registro automático</li>
            <li style={{ padding: theme.space[2], borderBottom: '1px solid #f0eeff' }}>🗺️ Mapa Consciente colaborativo</li>
            <li style={{ padding: theme.space[2] }}>🎮 Juegos y desafíos para aprender jugando</li>
          </ul>
          <p style={{ marginTop: theme.space[3], color: theme.colors.textSecondary, fontStyle: 'italic' }}>Todo sin costo, con total privacidad y basado en evidencia científica.</p>
        </div>

        <div style={buttonGroupStyle}>
          <Button onClick={handleDescargar} style={{ background: theme.colors.accentPrimary }}>
            📲 Descargar Anupubba
          </Button>
          <Button
            onClick={handleDonacion}
            style={{
              background: '#FF6B6B',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
            }}
          >
            ❤️ Apoyar el proyecto (donación voluntaria)
          </Button>
        </div>

        {/* QR Code con API externa */}
        <div style={qrContainerStyle}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(APP_URL)}`}
            alt="Código QR para descargar Anupubba"
            style={{ width: 180, height: 180 }}
          />
          <p style={{ marginTop: theme.space[2], fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
            Escanea el código QR para descargar la app
          </p>
        </div>

        {/* Enlace debajo del QR */}
        <p style={{ marginTop: theme.space[6], fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
          🌐 <a 
            href={APP_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: theme.colors.accentPrimary, 
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            {APP_URL}
          </a>
        </p>

        {/* 🔬 AVISO DE INVESTIGACIÓN CIENTÍFICA */}
        <div style={{
          marginTop: theme.space[4],
          padding: theme.space[4],
          background: '#f0f4ff',
          borderRadius: theme.radius.card,
          border: '1px solid #d0d8ff',
          textAlign: 'left',
        }}>
          <p style={{
            fontSize: theme.font.size.sm,
            color: theme.colors.textSecondary,
            margin: 0,
            lineHeight: 1.6,
          }}>
            <strong>🔬 Investigación científica:</strong> Parte de los datos anonimizados generados en la app podrán ser utilizados con fines de investigación científica para mejorar la comprensión del bienestar y la salud mental. 
            <strong> Los datos personales nunca serán compartidos.</strong> Al usar la app, aceptas esta condición. 
            Puedes revocar tu consentimiento en cualquier momento desde la sección <a href="/about" style={{ color: theme.colors.accentPrimary, fontWeight: 'bold' }}>"Acerca de"</a>.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;