import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { theme } from '../theme';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recordatorios, setRecordatorios] = useState(false);
  const [consentimiento, setConsentimiento] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!consentimiento) {
      setError('Debes aceptar el tratamiento de tus datos para continuar.');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: nombre });
      await sendEmailVerification(user);

      await setDoc(doc(db, 'userProfiles', user.uid), {
        nombre: nombre,
        email: email,
        edad: '',
        sexo: '',
        region: '',
        sueno: '',
        actividadFisica: '',
        intereses: [],
        consentimiento: true,
        investigacion: true, // ✅ Consentimiento para investigación
        recordatoriosActivos: recordatorios,
        createdAt: new Date().toISOString(),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Inicia sesión o usa otro.');
      } else {
        setError('Error al registrarte. Intenta de nuevo.');
      }
    }
    setLoading(false);
  };

  const pageStyle = {
    maxWidth: '400px',
    margin: `${theme.space[8]} auto`,
    padding: theme.space[4],
  };

  const titleStyle = {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.xxl,
    fontWeight: theme.font.weight.emphasis,
    marginBottom: theme.space[2],
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    margin: `${theme.space[2]} 0`,
    padding: theme.space[3],
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.button,
    fontSize: theme.font.size.base,
    transition: 'all 0.2s',
  };

  const checkboxStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.space[2],
    margin: `${theme.space[3]} 0`,
    fontSize: theme.font.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: '1.5',
  };

  const buttonStyle = {
    width: '100%',
    padding: theme.space[3],
    background: theme.colors.accentPrimary,
    color: 'white',
    border: 'none',
    borderRadius: theme.radius.button,
    fontSize: theme.font.size.base,
    fontWeight: theme.font.weight.emphasis,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Crear cuenta</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <div style={checkboxStyle}>
          <input
            type="checkbox"
            id="recordatorios"
            checked={recordatorios}
            onChange={(e) => setRecordatorios(e.target.checked)}
            style={{ marginTop: '4px' }}
          />
          <label htmlFor="recordatorios">
            📧 Deseo recibir recordatorios por email cuando tenga tests de bienestar disponibles.
          </label>
        </div>

        {/* 👇 NUEVO CHECKBOX DE CONSENTIMIENTO PARA INVESTIGACIÓN */}
        <div style={checkboxStyle}>
          <input
            type="checkbox"
            id="consentimiento"
            checked={consentimiento}
            onChange={(e) => setConsentimiento(e.target.checked)}
            style={{ marginTop: '4px' }}
            required
          />
          <label htmlFor="consentimiento">
            ✅ Acepto que mis datos (anonimizados) sean utilizados con fines de <strong>investigación científica</strong> para mejorar la plataforma y contribuir al estudio del bienestar. La información se trata de forma agregada y confidencial, conforme a la <strong>Ley 21.719</strong>.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <div style={{ marginTop: theme.space[4] }}>
        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </div>
  );
};

export default Register;