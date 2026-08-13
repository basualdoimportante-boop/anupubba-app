import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NeuroPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      if (!currentUser) {
        setError('Inicia sesión para ver los módulos.');
        setLoading(false);
        return;
      }

      try {
        const modulesSnap = await getDocs(collection(db, 'neuroModules'));
        const modulesData = [];
        modulesSnap.forEach((doc) => {
          modulesData.push({ id: doc.id, ...doc.data() });
        });
        modulesData.sort((a, b) => a.order - b.order);
        setModules(modulesData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar módulos:', err);
        setError('Error al cargar los módulos.');
        setLoading(false);
      }
    };
    fetchModules();
  }, [currentUser]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando módulos...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#6C63FF' }}>🧠 Neurociencias</h2>
      <p>Descubre cómo funciona tu cerebro y cómo la meditación lo transforma.</p>

      {modules.length === 0 ? (
        <p>No hay módulos disponibles.</p>
      ) : (
        modules.map((mod) => (
          <div key={mod.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#6C63FF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{mod.icon}</span> {mod.title}
            </h3>
            <p style={{ color: '#555', fontStyle: 'italic' }}>{mod.description}</p>

            {mod.summary && (
              <div style={{ marginTop: '16px' }}>
                <h4>📖 Resumen</h4>
                <p>{mod.summary}</p>
              </div>
            )}

            {mod.keyData && Array.isArray(mod.keyData) && mod.keyData.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4>🔑 Datos clave</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {mod.keyData.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {mod.practicalTips && (
              <div style={{ marginTop: '16px', background: '#f0eeff', padding: '16px', borderRadius: '12px' }}>
                <h4>💡 Consejo práctico</h4>
                <p>{mod.practicalTips}</p>
              </div>
            )}

            <button
              onClick={() => navigate(`/neuro/desafio/${mod.id}`)}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                background: '#6C63FF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
              }}
            >
              🧠 Comenzar desafío
            </button>
          </div>
        ))
      )}

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Volver
      </button>
    </div>
  );
};

export default NeuroPage;