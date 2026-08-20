import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Button from './Button';

const SpiritualPage = () => {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const modulesSnap = await getDocs(collection(db, 'caminos'));
        const modulesData = [];
        modulesSnap.forEach((doc) => {
          modulesData.push({ id: doc.id, ...doc.data() });
        });
        modulesData.sort((a, b) => a.order - b.order);
        setModules(modulesData);

        try {
          const docRef = doc(db, 'caminosProgress', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProgress(docSnap.data());
          } else {
            setProgress(null);
          }
        } catch (err) {
          if (err.code === 'permission-denied' || err.message.includes('Missing or insufficient permissions')) {
            console.log('ℹ️ No hay progreso guardado para este usuario (documento vacío).');
            setProgress(null);
          } else {
            console.warn('⚠️ Error al leer progreso:', err);
            setProgress(null);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('❌ Error al cargar módulos:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const isChapterLocked = (index) => {
    if (index === 0) return false;
    const prevChapterId = modules[index - 1]?.id;
    if (!progress) return true;
    return !(progress[prevChapterId] && progress[prevChapterId].passed === true);
  };

  if (loading) {
    return <div style={{ padding: theme.space[8], textAlign: 'center' }}>Cargando módulos...</div>;
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div style={{ maxWidth: '900px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xxl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>🕉️ Caminos Espirituales</h2>
      <p style={{ color: theme.colors.textSecondary, marginBottom: theme.space[6] }}>Explora las tradiciones filosóficas y espirituales.</p>

      {modules.length === 0 ? (
        <p>No hay módulos disponibles.</p>
      ) : (
        modules.map((mod, index) => {
          const locked = isChapterLocked(index);
          const isCompleted = progress && progress[mod.id] && progress[mod.id].passed === true;
          return (
            <div key={mod.id} style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[4], marginBottom: theme.space[4], boxShadow: theme.shadow.card, opacity: locked ? 0.6 : 1 }}>
              <h3 style={{ color: theme.colors.textPrimary }}>{mod.title}</h3>
              <p style={{ color: theme.colors.textSecondary }}>{mod.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.space[3] }}>
                <span style={{ fontSize: theme.font.size.sm, color: locked ? theme.colors.textSecondary : theme.colors.accentCalm }}>
                  {isCompleted ? '✅ Completado' : locked ? '🔒 Bloqueado' : '📖 Disponible'}
                </span>
                {!locked && (
                  <Button onClick={() => navigate(`/caminos/desafio/${mod.id}`)} style={{ width: 'auto' }}>
                    {isCompleted ? 'Repetir desafío' : 'Comenzar'}
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}
      <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: theme.space[4] }}>
        ← Volver al menú
      </Button>
      <button onClick={scrollToTop} style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '12px 16px', background: theme.colors.accentPrimary, color: '#fff', border: 'none', borderRadius: '50%', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>↑</button>
    </div>
  );
};

export default SpiritualPage;