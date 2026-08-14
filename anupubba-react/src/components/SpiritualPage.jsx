import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SpiritualPage = () => {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modulesSnap = await getDocs(collection(db, 'caminos'));
        const modulesData = [];
        modulesSnap.forEach((doc) => {
          modulesData.push({ id: doc.id, ...doc.data() });
        });
        modulesData.sort((a, b) => a.order - b.order);
        setModules(modulesData);

        if (currentUser) {
          try {
            const progressQuery = query(
              collection(db, 'caminosProgress'),
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
            console.warn('No se pudo cargar el progreso:', err);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando módulos...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#6C63FF' }}>🕉️ Caminos Espirituales</h2>
      <p>Explora las tradiciones filosóficas y espirituales.</p>

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
                borderRadius: '12px',
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
                    onClick={() => navigate(`/caminos/desafio/${mod.id}`)}
                    style={{
                      padding: '8px 16px',
                      background: '#6C63FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
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

      {/* 🔥 Botón "Volver al menú" */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '24px',
          padding: '12px',
          background: '#e2e8f0',
          color: '#4a5568',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#cbd5e0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#e2e8f0';
        }}
      >
        ← Volver al menú
      </button>

      {/* Botón flotante para subir */}
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 16px',
          background: '#6C63FF',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(108, 99, 255, 0.4)',
        }}
      >
        ↑
      </button>
    </div>
  );
};

export default SpiritualPage;