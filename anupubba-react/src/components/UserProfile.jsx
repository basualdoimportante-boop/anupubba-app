// src/components/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';

function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  
  // ✅ Estado del usuario actual
  const [user, setUser] = useState(null);

  // ✅ Obtener usuario actual
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const [formData, setFormData] = useState({
    displayName: '',
    birthYear: '',
    sex: '',
    region: '',
    sleepHours: '',
    physicalActivity: '',
    interests: '',
    meditationPractice: false,
    researchConsent: false,
    dataTreatmentConsent: false // ✅ Nuevo consentimiento para tratamiento de datos
  });

  const regions = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
    'Valparaíso', 'Metropolitana', 'O\'Higgins', 'Maule', 'Ñuble',
    'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
  ];

  const physicalActivities = [
    'Sedentario (poco o ningún ejercicio)',
    'Bajo (1-2 veces por semana)',
    'Moderado (3-4 veces por semana)',
    'Alto (5-7 veces por semana)'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ✅ Reenviar correo de verificación
  const handleResendVerification = async () => {
    if (!user) return;
    setResendLoading(true);
    setResendMessage('');
    try {
      await sendEmailVerification(user);
      setResendMessage('✅ Correo de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setResendMessage(`❌ Error: ${err.message}`);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('Debes iniciar sesión para guardar tu perfil.');
        setLoading(false);
        return;
      }

      // ✅ VERIFICACIÓN DE EMAIL
      if (!currentUser.emailVerified) {
        setError('⚠️ Debes verificar tu correo electrónico antes de completar tu perfil. Revisa tu bandeja de entrada o usa el botón "Reenviar verificación".');
        setLoading(false);
        return;
      }

      // ✅ CONSENTIMIENTO PARA TRATAMIENTO DE DATOS (obligatorio)
      if (!formData.dataTreatmentConsent) {
        setError('Debes aceptar el tratamiento de tus datos personales para continuar.');
        setLoading(false);
        return;
      }

      // Validaciones
      if (!formData.displayName.trim()) {
        setError('Por favor, ingresa tu nombre.');
        setLoading(false);
        return;
      }
      const birthYearNum = parseInt(formData.birthYear);
      if (isNaN(birthYearNum) || birthYearNum < 1900 || birthYearNum > 2010) {
        setError('Ingresa un año de nacimiento válido (1900-2010).');
        setLoading(false);
        return;
      }

      // Guardar en Firestore
      const profileData = {
        userId: currentUser.uid,
        displayName: formData.displayName.trim(),
        birthYear: birthYearNum,
        sex: formData.sex,
        region: formData.region,
        sleepHours: parseFloat(formData.sleepHours) || 0,
        physicalActivity: formData.physicalActivity,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        meditationPractice: formData.meditationPractice,
        researchConsent: formData.researchConsent,
        dataTreatmentConsent: formData.dataTreatmentConsent,
        emailVerified: currentUser.emailVerified,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'userProfiles', currentUser.uid), profileData, { merge: true });

      navigate('/');
    } catch (err) {
      console.error('Error al guardar perfil:', err);
      setError('Error al guardar el perfil. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Si el email no está verificado, mostrar pantalla de advertencia
  if (user && !user.emailVerified) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
        <h2>📧 Verifica tu correo</h2>
        <div style={{
          padding: '20px',
          background: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107',
          margin: '20px 0'
        }}>
          <p style={{ fontSize: '1.1rem' }}>
            ⚠️ Tu correo <strong>{user.email}</strong> aún no ha sido verificado.
          </p>
          <p style={{ color: '#555' }}>
            Para completar tu perfil y acceder a todas las funciones, verifica tu correo.
            <br />
            Revisa tu bandeja de entrada (y la carpeta de spam).
          </p>
          <button
            onClick={handleResendVerification}
            disabled={resendLoading}
            style={{
              padding: '10px 20px',
              background: '#6C63FF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: resendLoading ? 'not-allowed' : 'pointer',
              opacity: resendLoading ? 0.7 : 1,
              marginTop: '10px'
            }}
          >
            {resendLoading ? 'Enviando...' : 'Reenviar correo de verificación'}
          </button>
          {resendMessage && <p style={{ marginTop: '10px' }}>{resendMessage}</p>}
        </div>
        <button
          onClick={() => auth.signOut()}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#666',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>🧘 Completa tu perfil</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Estos datos nos ayudarán a personalizar tus recomendaciones y, si aceptas, a contribuir a la investigación en salud mental.
      </p>

      <form onSubmit={handleSubmit}>
        {/* NOMBRE */}
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre (para mostrarlo en la app)</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Ej. Juan"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* AÑO DE NACIMIENTO */}
        <div style={{ marginBottom: '15px' }}>
          <label>Año de nacimiento</label>
          <input
            type="number"
            name="birthYear"
            value={formData.birthYear}
            onChange={handleChange}
            placeholder="Ej. 1990"
            min="1900"
            max="2010"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* SEXO */}
        <div style={{ marginBottom: '15px' }}>
          <label>Sexo biológico</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Selecciona...</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="non-binary">No binario</option>
          </select>
        </div>

        {/* REGIÓN */}
        <div style={{ marginBottom: '15px' }}>
          <label>Región de Chile</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Selecciona...</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* HORAS DE SUEÑO */}
        <div style={{ marginBottom: '15px' }}>
          <label>Horas de sueño por noche (promedio)</label>
          <input
            type="number"
            name="sleepHours"
            value={formData.sleepHours}
            onChange={handleChange}
            placeholder="Ej. 7.5"
            min="0"
            max="24"
            step="0.5"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* ACTIVIDAD FÍSICA */}
        <div style={{ marginBottom: '15px' }}>
          <label>Nivel de actividad física</label>
          <select
            name="physicalActivity"
            value={formData.physicalActivity}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Selecciona...</option>
            {physicalActivities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* INTERESES */}
        <div style={{ marginBottom: '15px' }}>
          <label>Intereses (separados por comas)</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Ej. deporte, arte, lectura, música"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* MEDITACIÓN */}
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            name="meditationPractice"
            checked={formData.meditationPractice}
            onChange={handleChange}
          />
          <label>Practico meditación o mindfulness regularmente</label>
        </div>

        {/* ✅ CONSENTIMIENTO PARA TRATAMIENTO DE DATOS (OBLIGATORIO) */}
        <div style={{
          marginBottom: '15px',
          padding: '15px',
          background: '#f0f4ff',
          borderRadius: '8px',
          borderLeft: '4px solid #6C63FF'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input
              type="checkbox"
              name="dataTreatmentConsent"
              checked={formData.dataTreatmentConsent}
              onChange={handleChange}
              style={{ marginTop: '2px' }}
              required
            />
            <div>
              <label>
                <strong>🔒 Acepto el tratamiento de mis datos personales</strong>
              </label>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '5px 0 0 0' }}>
                Tus datos serán utilizados exclusivamente para generar recomendaciones personalizadas y mejorar la app. No serán compartidos con terceros sin tu consentimiento explícito, de acuerdo con la Ley 21.719 de Chile.
              </p>
            </div>
          </div>
        </div>

        {/* CONSENTIMIENTO PARA INVESTIGACIÓN (OPCIONAL) */}
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: '#f0f7ff',
          borderRadius: '8px',
          borderLeft: '4px solid #6C63FF'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input
              type="checkbox"
              name="researchConsent"
              checked={formData.researchConsent}
              onChange={handleChange}
              style={{ marginTop: '2px' }}
            />
            <div>
              <label>
                <strong>🔬 Acepto que mis datos anónimos sean utilizados para investigación en salud mental (opcional)</strong>
              </label>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '5px 0 0 0' }}>
                Tus datos serán seudonimizados (no se compartirá tu identidad). Podrás retirar tu consentimiento en cualquier momento desde tu perfil. Esta contribución ayudará a entender mejor la salud mental en Chile.
              </p>
            </div>
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>❌ {error}</p>}

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
          {loading ? 'Guardando...' : 'Guardar perfil y continuar'}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;