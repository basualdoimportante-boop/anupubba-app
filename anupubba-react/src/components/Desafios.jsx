import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDesafios, getRachas } from '../services/gamificationService';

const Desafios = () => {
  const { currentUser } = useAuth();
  const [misiones, setMisiones] = useState([]);
  const [rachas, setRachas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        const misionesData = await getDesafios(currentUser.uid);
        const rachasData = await getRachas(currentUser.uid);
        setMisiones(misionesData);
        setRachas(rachasData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando desafíos...</div>;

  const completadas = misiones.filter(m => m.completada).length;
  const total = misiones.length;
  const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginTop: '24px' }}>
      <h3 style={{ color: '#6C63FF', marginBottom: '8px' }}>🏅 Desafíos y rachas</h3>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ background: '#f0eeff', padding: '8px 16px', borderRadius: '20px' }}>
          <span>🧘 Meditación: <strong>{rachas.meditacion?.diasConsecutivos || 0} días</strong></span>
        </div>
        <div style={{ background: '#f0eeff', padding: '8px 16px', borderRadius: '20px' }}>
          <span>📋 Tests: <strong>{rachas.tests?.diasConsecutivos || 0} días</strong></span>
        </div>
        <div style={{ background: '#f0eeff', padding: '8px 16px', borderRadius: '20px' }}>
          <span>📚 Aprendizaje: <strong>{rachas.aprendizaje?.diasConsecutivos || 0} días</strong></span>
        </div>
      </div>

      <div style={{ background: '#f9f9ff', borderRadius: '12px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Progreso: {completadas}/{total} misiones</span>
          <span>{progreso}%</span>
        </div>
        <div style={{ background: '#e0e0e0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${progreso}%`, background: '#6C63FF', height: '100%' }} />
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
        {misiones.map(m => (
          <li key={m.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{m.completada ? '✅' : '⬜'}</span>
            <span style={{ flex: 1 }}>{m.nombre}</span>
            <span style={{ fontSize: '12px', color: '#888' }}>{m.completada ? `🏆 ${m.recompensa}` : '🔒'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Desafios;