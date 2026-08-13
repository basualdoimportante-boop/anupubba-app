import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeportesPage = () => {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Leer módulos (público)
        const modulesSnap = await getDocs(collection(db, 'deportes'));
        const modulesData = [];
        modulesSnap.forEach((doc) => {
          modulesData.push({ id: doc.id, ...doc.data() });
        });
        modulesData.sort((a, b) => a.order - b.order);
        setModules(modulesData);

        // 2. Leer progreso solo si el usuario está autenticado
        if (currentUser) {
          try {
            const progressQuery = query(
              collection(db, 'deportesProgress'),
              where('userId', '==', currentUser.uid)
            );
            const progressSnap = await getDocs(progressQuery);
            const progressData = {};
            progressSnap.forEach((doc) => {
              const data = doc.data();
              progressData[data.chapterId] = data;
            });
            setProgress(progressData);
          } catch (err) {
            console.warn('No se pudo cargar el progreso (permisos insuficientes):', err);
            // Si falla, dejamos progress vacío
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar módulos:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const isChapterLocked = (index) => {
    if (index === 0) return false;
    const prevChapterId = modules[index - 1]?.id;
    const prevProgress = progress[prevChapterId];
    return !(prevProgress && prevProgress.passed);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando módulos...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#6C63FF' }}>🏃 Deportes</h2>
      <p>Conoce los fundamentos del entrenamiento y la actividad física.</p>
      <div style={{ marginTop: '20px' }}>
        {modules.length === 0 ? (
          <p>No hay módulos disponibles.</p>
        ) : (
          modules.map((mod, index) => {
            const locked = isChapterLocked(index);
            const prog = progress[mod.id];
            const isCompleted = prog && prog.passed;
            return (
              <div
                key={mod.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  background: locked ? '#f5f5f5' : 'white',
                  opacity: locked ? 0.6 : 1,
                }}
              >
                <h3>{mod.title}</h3>
                <p>{mod.description}</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {isCompleted ? '✅ Completado' : locked ? '🔒 Bloqueado' : '📖 Disponible'}
                  </span>
                  {!locked && (
                    <button
                      onClick={() => navigate(`/deportes/desafio/${mod.id}`)}
                      style={{
                        padding: '8px 16px',
                        background: '#6C63FF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {isCompleted ? 'Repetir desafío' : 'Comenzar'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Volver
      </button>
    </div>
  );
};

export default DeportesPage;