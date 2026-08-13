import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión. Revisa tus credenciales.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError('Error con Google. Intenta de nuevo.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
      <button onClick={handleGoogle} style={{ marginTop: '10px', padding: '10px 20px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
        Google
      </button>
      <div style={{ marginTop: '10px' }}>
        <Link to="/register">¿No tienes cuenta? Regístrate</Link>
      </div>
      <div>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  );
};

export default Login;