import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { theme } from '../theme';
import Button from './Button';
import Card from './Card';
import { HeartHandshake } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [recordatoriosActivos, setRecordatoriosActivos] = useState(false);
  const [loadingPref, setLoadingPref] = useState(true);

  useEffect(() => {
    const loadPref = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'userProfiles', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecordatoriosActivos(docSnap.data().recordatoriosActivos || false);
        }
        setLoadingPref(false);
      } catch (err) {
        console.error(err);
        setLoadingPref(false);
      }
    };
    loadPref();
  }, [currentUser]);

  const toggleRecordatorios = async () => {
    if (!currentUser) return;
    try {
      const newValue = !recordatoriosActivos;
      await updateDoc(doc(db, 'userProfiles', currentUser.uid), { recordatoriosActivos: newValue });
      setRecordatoriosActivos(newValue);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar preferencia.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const pageStyle = {
    maxWidth: '500px',
    margin: `${theme.space[8]} auto`,
    padding: theme.space[4],
  };

  const titleStyle = {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.xxxl,
    fontWeight: theme.font.weight.emphasis,
    marginBottom: theme.space[2],
  };

  const subtitleStyle = {
    color: theme.colors.textSecondary,
    marginBottom: theme.space[6],
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.space[3],
  };

  if (loadingPref) {
    return <div style={{ padding: theme.space[8], textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🌅 Anupubba</h1>
      <p style={subtitleStyle}>Bienvenido, {currentUser?.email}</p>

      <div style={buttonContainerStyle}>
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
    </div>
  );
};

export default Dashboard;