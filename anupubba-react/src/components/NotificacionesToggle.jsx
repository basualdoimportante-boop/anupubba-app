import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { requestPermissionAndGetToken } from '../firebase-messaging';

const NotificacionesToggle = () => {
  const { currentUser } = useAuth();
  const [activadas, setActivadas] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const checkToken = async () => {
      const docRef = doc(db, 'tokensNotificacion', currentUser.uid);
      const docSnap = await getDoc(docRef);
      setActivadas(docSnap.exists());
    };
    checkToken();
  }, [currentUser]);

  const activar = async () => {
    setLoading(true);
    try {
      const token = await requestPermissionAndGetToken();
      if (!token) {
        alert('No se pudo obtener permiso. Acepta las notificaciones en el navegador.');
        setLoading(false);
        return;
      }
      await setDoc(doc(db, 'tokensNotificacion', currentUser.uid), {
        token,
        userId: currentUser.uid,
        updatedAt: new Date().toISOString()
      });
      setActivadas(true);
      alert('✅ Notificaciones activadas.');
    } catch (err) {
      console.error(err);
      alert('Error al activar notificaciones.');
    }
    setLoading(false);
  };

  const desactivar = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'tokensNotificacion', currentUser.uid));
      setActivadas(false);
      alert('❌ Notificaciones desactivadas.');
    } catch (err) {
      console.error(err);
      alert('Error al desactivar notificaciones.');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={activadas ? desactivar : activar}
      disabled={loading}
      style={{
        padding: '14px 20px',
        background: activadas ? '#28a745' : '#6C63FF',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
      }}
    >
      {activadas ? '📲 Notificaciones activadas' : '🔔 Activar notificaciones push'}
    </button>
  );
};

export default NotificacionesToggle;