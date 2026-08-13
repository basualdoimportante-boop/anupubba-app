// src/components/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h2>🔑 Restablecer contraseña</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Enviando...' : 'Enviar correo'}
        </button>
      </form>

      {message && <p style={{ color: '#2e7d32', marginTop: '15px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>❌ {error}</p>}

      <p style={{ marginTop: '20px' }}>
        <Link to="/login" style={{ color: '#6C63FF' }}>← Volver al inicio de sesión</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;