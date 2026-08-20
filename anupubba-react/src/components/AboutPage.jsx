import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Button from './Button';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[6], boxShadow: theme.shadow.card }}>
        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xxxl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>🌅 Anupubba</h1>
        <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.lg, marginBottom: theme.space[6] }}>Bienestar personal con base científica</p>

        <div style={{ marginBottom: theme.space[6] }}>
          <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>Acerca de Anupubba</h2>
          <p style={{ color: theme.colors.textSecondary, lineHeight: 1.8 }}>
            Anupubba es una herramienta gratuita de bienestar personal diseñada para ayudarte a entender qué sucede en tu cerebro y cuerpo al practicar meditación, distinguir evidencia sólida de creencias populares, y aplicar ese conocimiento a tu vida diaria.
          </p>
        </div>

        <div style={{ marginBottom: theme.space[6] }}>
          <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>🔬 Investigación científica</h2>
          <p style={{ color: theme.colors.textSecondary, lineHeight: 1.8 }}>
            Los datos anonimizados generados en la app podrán ser utilizados con fines de investigación científica para mejorar la comprensión del bienestar y la salud mental. <strong>Los datos personales nunca serán compartidos.</strong>
          </p>
          <p style={{ color: theme.colors.textSecondary, lineHeight: 1.8, marginTop: theme.space[3] }}>
            Puedes revocar tu consentimiento en cualquier momento enviando un correo a <strong>anupubba@gmail.com</strong>.
          </p>
        </div>

        <div style={{ marginBottom: theme.space[6] }}>
          <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>📋 Política de privacidad</h2>
          <p style={{ color: theme.colors.textSecondary, lineHeight: 1.8 }}>
            En Anupubba nos tomamos tu privacidad en serio. Todos los datos que compartes son <strong>anonimizados</strong> (tu identidad se guarda como un hash) y <strong>no se comparten</strong> con terceros. Puedes solicitar la eliminación de tus datos en cualquier momento.
          </p>
        </div>

        <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: theme.space[4] }}>
          ← Volver al menú
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;