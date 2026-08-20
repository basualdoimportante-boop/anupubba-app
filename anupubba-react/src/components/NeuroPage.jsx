import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Button from './Button';

const NeuroPage = () => {
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
        // 1. Módulos
        const modulesSnap = await getDocs(collection(db, 'neuroModules'));
        const modulesData = [];
        modulesSnap.forEach((doc) => {
          modulesData.push({ id: doc.id, ...doc.data() });
        });
        modulesData.sort((a, b) => a.order - b.order);
        setModules(modulesData);

        // 2. Progreso (lectura directa por ID)
        try {
          const docRef = doc(db, 'neuroProgress', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProgress(docSnap.data());
          } else {
            setProgress(null);
          }
        } catch (err) {
          // Si el documento no existe, es normal (sin progreso)
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

  return (
    <div style={{ maxWidth: '900px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xxl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>🧠 Neurociencias</h2>
      <p style={{ color: theme.colors.textSecondary, marginBottom: theme.space[6] }}>Descubre cómo funciona tu cerebro y cómo la meditación lo transforma.</p>

      {modules.length === 0 ? (
        <p>No hay módulos disponibles.</p>
      ) : (
        modules.map((mod, index) => {
          const locked = isChapterLocked(index);
          const isCompleted = progress && progress[mod.id] && progress[mod.id].passed === true;
          return (
            <div key={mod.id} style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[4], marginBottom: theme.space[4], boxShadow: theme.shadow.card, opacity: locked ? 0.6 : 1 }}>
              <h3 style={{ color: theme.colors.textPrimary, display: 'flex', alignItems: 'center', gap: theme.space[2] }}>
                <span>{mod.icon}</span> {mod.title}
              </h3>
              <p style={{ color: theme.colors.textSecondary }}>{mod.description}</p>
              {mod.summary && (
                <div style={{ marginTop: theme.space[2], fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
                  <strong>Resumen:</strong> {mod.summary.substring(0, 150)}...
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.space[3] }}>
                <span style={{ fontSize: theme.font.size.sm, color: locked ? theme.colors.textSecondary : theme.colors.accentCalm }}>
                  {isCompleted ? '✅ Completado' : locked ? '🔒 Bloqueado' : '📖 Disponible'}
                </span>
                {!locked && (
                  <Button onClick={() => navigate(`/neuro/desafio/${mod.id}`)} style={{ width: 'auto' }}>
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
    </div>
  );
};

export default NeuroPage;