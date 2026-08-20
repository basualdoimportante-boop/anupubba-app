import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDesafios, getRachas } from '../services/gamificationService';
import { theme } from '../theme';

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
        console.error('Error al cargar desafíos:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading) return <div style={{ padding: theme.space[4], textAlign: 'center' }}>Cargando desafíos...</div>;

  const completadas = misiones.filter(m => m.completada).length;
  const total = misiones.length;
  const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[4], boxShadow: theme.shadow.card, marginTop: theme.space[6] }}>
      <h3 style={{ color: theme.colors.accentPrimary, marginBottom: theme.space[3] }}>🏅 Desafíos y rachas</h3>
      <div style={{ display: 'flex', gap: theme.space[3], marginBottom: theme.space[4], flexWrap: 'wrap' }}>
        <div style={{ background: theme.colors.accentSecondary + '20', padding: `${theme.space[2]} ${theme.space[4]}`, borderRadius: theme.radius.pill }}>
          <span>🧘 Meditación: <strong>{rachas.meditacion?.diasConsecutivos || 0} días</strong></span>
        </div>
        <div style={{ background: theme.colors.accentSecondary + '20', padding: `${theme.space[2]} ${theme.space[4]}`, borderRadius: theme.radius.pill }}>
          <span>📚 Aprendizaje: <strong>{rachas.aprendizaje?.diasConsecutivos || 0} días</strong></span>
        </div>
      </div>

      <div style={{ background: theme.colors.bg, borderRadius: theme.radius.card, padding: theme.space[3] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.space[2] }}>
          <span style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>Progreso: {completadas}/{total} misiones</span>
          <span style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>{progreso}%</span>
        </div>
        <div style={{ background: '#e0e0e0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${progreso}%`, background: theme.colors.accentPrimary, height: '100%' }} />
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: theme.space[3] }}>
        {misiones.map(m => (
          <li key={m.id} style={{ padding: `${theme.space[2]} 0`, borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', alignItems: 'center', gap: theme.space[2] }}>
            <span>{m.completada ? '✅' : '⬜'}</span>
            <span style={{ flex: 1, fontSize: theme.font.size.sm, color: theme.colors.textPrimary }}>{m.nombre}</span>
            <span style={{ fontSize: theme.font.size.xs, color: theme.colors.textSecondary }}>{m.completada ? `🏆 ${m.recompensa}` : '🔒'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Desafios;