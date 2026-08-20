import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Desafios from './Desafios';
import { inicializarDesafios } from '../services/gamificationService';
import { theme } from '../theme';
import Button from './Button';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [recordatoriosActivos, setRecordatoriosActivos] = useState(false);
  const [loadingPref, setLoadingPref] = useState(true);

  // 🔗 Enlace de donación de Mercado Pago
  const DONACION_URL = 'https://mpago.la/1REi7T2';

  useEffect(() => {
    const initUser = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, 'desafios', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await inicializarDesafios(currentUser.uid);
        }
      } catch (err) {
        console.error('Error al inicializar desafíos:', err);
      }

      try {
        const docRef = doc(db, 'userProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRecordatoriosActivos(data.recordatoriosActivos || false);
        }
        setLoadingPref(false);
      } catch (err) {
        console.error('Error al cargar preferencia:', err);
        setLoadingPref(false);
      }
    };
    initUser();
  }, [currentUser]);

  const toggleRecordatorios = async () => {
    if (!currentUser) return;
    try {
      const newValue = !recordatoriosActivos;
      const docRef = doc(db, 'userProfiles', currentUser.uid);
      await updateDoc(docRef, { recordatoriosActivos: newValue });
      setRecordatoriosActivos(newValue);
      alert(
        newValue
          ? '✅ Recordatorios por email activados. Recibirás avisos cuando tengas tests disponibles.'
          : '❌ Recordatorios por email desactivados.'
      );
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la preferencia.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDonacion = () => {
    window.open(DONACION_URL, '_blank', 'noopener,noreferrer');
  };

  if (loadingPref) {
    return <div style={{ padding: theme.space[8], textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xxxl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>🌅 Anupubba</h1>
      <p style={{ color: theme.colors.textSecondary, marginBottom: theme.space[6] }}>Bienvenido, {currentUser?.email}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[3] }}>
        <Button onClick={() => navigate('/tests')}>📋 Tests</Button>
        <Button onClick={() => navigate('/neuro')}>🧠 Neurociencias</Button>
        <Button onClick={() => navigate('/deportes')}>🏃 Deportes</Button>
        <Button onClick={() => navigate('/caminos')}>🕉️ Caminos Espirituales</Button>
        <Button onClick={() => navigate('/meditaciones')}>🪷 Meditaciones</Button>
        <Button onClick={() => navigate('/juegos')}>🎮 Juegos</Button>
        <Button onClick={() => navigate('/mapa')}>🗺️ Mapa Consciente</Button>

        <Button
          variant="secondary"
          onClick={toggleRecordatorios}
          style={{
            background: recordatoriosActivos ? theme.colors.accentCalm : 'transparent',
            border: recordatoriosActivos ? 'none' : `2px solid ${theme.colors.accentPrimary}`,
            color: recordatoriosActivos ? '#FFFFFF' : theme.colors.accentPrimary,
          }}
        >
          {recordatoriosActivos ? '✅ Recordatorios activados' : '🔕 Recordatorios desactivados'}
        </Button>

        {/* 👇 BOTÓN DE DONACIÓN */}
        <Button
          onClick={handleDonacion}
          style={{
            background: '#FF6B6B',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          }}
        >
          ❤️ Apoyar el proyecto (donación voluntaria)
        </Button>

        <Button onClick={() => navigate('/about')}>🌅 Acerca de Anupubba</Button>

        <Button
          variant="secondary"
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: `2px solid ${theme.colors.textSecondary}`,
            color: theme.colors.textSecondary,
          }}
        >
          🚪 Cerrar sesión
        </Button>
      </div>

      <Desafios />
    </div>
  );
};

export default Dashboard;