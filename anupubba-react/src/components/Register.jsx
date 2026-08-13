import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recordatorios, setRecordatorios] = useState(false); // ← nuevo estado
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
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
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar perfil con nombre
      await updateProfile(user, { displayName: nombre });

      // Enviar email de verificación (opcional, pero recomendado)
      await sendEmailVerification(user);

      // Guardar datos en Firestore (userProfiles)
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
        recordatoriosActivos: recordatorios, // ← guardamos la preferencia
        createdAt: new Date().toISOString(),
      });

      // Redirigir al dashboard (o al login si prefieres)
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

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h2>Crear cuenta</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }}
          required
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ display: 'block', width: '100%', margin: '8px 0', padding: '8px' }}
          required
        />

        {/* Checkbox para recordatorios */}
        <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="recordatorios"
            checked={recordatorios}
            onChange={(e) => setRecordatorios(e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label htmlFor="recordatorios" style={{ fontSize: '14px', color: '#555' }}>
            📧 Deseo recibir recordatorios por email cuando tenga tests de bienestar disponibles.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '16px',
          }}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </div>
  );
};

export default Register;