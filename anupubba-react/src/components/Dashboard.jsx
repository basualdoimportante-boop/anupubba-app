import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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

  const buttonStyle = {
    padding: '14px 20px',
    background: '#6C63FF',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  if (loadingPref) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ color: '#6C63FF' }}>🌅 Anupubba</h1>
      <p>Bienvenido, {currentUser?.email}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <button onClick={() => navigate('/tests')} style={buttonStyle}>📋 Tests</button>
        <button onClick={() => navigate('/neuro')} style={buttonStyle}>🧠 Neurociencias</button>
        <button onClick={() => navigate('/deportes')} style={buttonStyle}>🏃 Deportes</button>
        <button onClick={() => navigate('/caminos')} style={buttonStyle}>🕉️ Caminos Espirituales</button>
        <button onClick={() => navigate('/meditaciones')} style={buttonStyle}>🪷 Meditaciones</button>
        <button onClick={() => navigate('/juegos')} style={buttonStyle}>🎮 Juegos</button>
        <button onClick={() => navigate('/mapa')} style={buttonStyle}>🗺️ Mapa Consciente</button>
        <button onClick={toggleRecordatorios} style={{ ...buttonStyle, background: recordatoriosActivos ? '#28a745' : '#6c757d' }}>
          {recordatoriosActivos ? '✅ Recordatorios activados' : '🔕 Recordatorios desactivados'}
        </button>
        <button onClick={handleLogout} style={{ ...buttonStyle, background: '#e53e3e' }}>🚪 Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Dashboard;