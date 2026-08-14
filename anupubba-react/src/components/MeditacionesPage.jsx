import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    </div>
  );
};

export default MeditacionesPage;