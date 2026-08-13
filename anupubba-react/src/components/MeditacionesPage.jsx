import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { actualizarRacha, completarMision } from '../services/gamificationService';

const MeditacionesPage = () => {
  const [meditaciones, setMeditaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [weekly, setWeekly] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'meditaciones'));
        const data = [];
        querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setMeditaciones(data);

        if (currentUser) {
          const registrosRef = collection(db, 'meditacionesRegistro');
          const q = query(registrosRef, where('userId', '==', currentUser.uid));
          const snapshot = await getDocs(q);
          const registros = [];
          snapshot.forEach(doc => registros.push(doc.data().fecha));
          setTotal(registros.length);

          const hoy = new Date();
          const ultimaSemana = [];
          for (let i = 6; i >= 0; i--) {
            const dia = new Date(hoy);
            dia.setDate(dia.getDate() - i);
            const diaStr = dia.toISOString().split('T')[0];
            const count = registros.filter(f => f.startsWith(diaStr)).length;
            ultimaSemana.push({ fecha: diaStr, count });
          }
          setWeekly(ultimaSemana);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const registrarMeditacion = async () => {
    if (!currentUser) {
      alert('Inicia sesión para registrar');
      return;
    }
    try {
      await addDoc(collection(db, 'meditacionesRegistro'), {
        userId: currentUser.uid,
        fecha: new Date().toISOString(),
      });

      // 🏅 ACTUALIZAR RACHA Y MISIONES
      await actualizarRacha(currentUser.uid, 'meditacion');

      // Verificar si ya tiene 3 días seguidos (esto se maneja desde el servicio)
      // Pero podemos disparar la misión manualmente si la racha es >= 3
      const q = query(
        collection(db, 'rachas'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      let rachaDias = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.meditacion) rachaDias = data.meditacion.diasConsecutivos || 0;
      });
      if (rachaDias >= 3) {
        await completarMision(currentUser.uid, 'meditacion_3_dias');
      }

      alert('🧘 ¡Meditación registrada! Sigue así.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error al registrar');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🪷 Meditaciones</h2>
      <p>Escucha y registra tus sesiones de meditación.</p>

      {currentUser && (
        <div style={{ background: '#f0eeff', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <p><strong>Total de sesiones:</strong> {total}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {weekly.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', background: 'white', padding: '8px', borderRadius: '8px', minWidth: '40px' }}>
                <div>{d.fecha.slice(5)}</div>
                <div style={{ fontWeight: 'bold', color: '#6C63FF' }}>{d.count}</div>
              </div>
            ))}
          </div>
          <button onClick={registrarMeditacion} style={{ marginTop: '12px', padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            + Registrar meditación
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {meditaciones.map((med) => (
          <div key={med.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <h3>{med.titulo}</h3>
            <p>{med.descripcion}</p>
            <audio controls src={med.url} style={{ width: '100%' }} />
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Volver
      </button>
    </div>
  );
};

export default MeditacionesPage;