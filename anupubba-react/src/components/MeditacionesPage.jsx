import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Button from './Button';
import Card from './Card';

const MeditacionesPage = () => {
  const [meditaciones, setMeditaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ hoy: 0, semana: 0, mes: 0 });
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sesionRegistrada, setSesionRegistrada] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener meditaciones
        const medSnap = await getDocs(collection(db, 'meditaciones'));
        const medData = [];
        medSnap.forEach((doc) => {
          const data = doc.data();
          // 🔥 USAMOS LOS CAMPOS REALES: fileUrl y title
          const med = {
            id: doc.id,
            title: data.title || 'Sin título',
            url: data.fileUrl || '', // ← campo real en Firestore
            description: data.description || '',
            order: data.order || 0,
          };
          medData.push(med);
          console.log('📦 Meditación cargada:', med.title, 'URL:', med.url);
        });
        // Ordenar por order
        medData.sort((a, b) => a.order - b.order);
        setMeditaciones(medData);

        // 2. Obtener registros del usuario
        if (currentUser) {
          const q = query(
            collection(db, 'meditacionesRegistro'),
            where('userId', '==', currentUser.uid),
            orderBy('fecha', 'desc')
          );
          const regSnap = await getDocs(q);
          const regData = [];
          regSnap.forEach((doc) => regData.push({ id: doc.id, ...doc.data() }));
          setRegistros(regData);

          // Calcular estadísticas
          const ahora = new Date();
          const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
          const semanaInicio = new Date(ahora);
          semanaInicio.setDate(ahora.getDate() - ahora.getDay());
          semanaInicio.setHours(0, 0, 0, 0);
          const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

          let hoyCount = 0, semanaCount = 0, mesCount = 0;
          regData.forEach((reg) => {
            const fechaReg = new Date(reg.fecha);
            if (fechaReg >= hoyInicio) hoyCount++;
            if (fechaReg >= semanaInicio) semanaCount++;
            if (fechaReg >= mesInicio) mesCount++;
          });
          setEstadisticas({ hoy: hoyCount, semana: semanaCount, mes: mesCount });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  // Registrar sesión automáticamente al reproducir
  const handlePlay = async (meditacionId) => {
    if (!currentUser) {
      console.warn('Usuario no autenticado');
      return;
    }
    if (sesionRegistrada[meditacionId]) {
      console.log('Sesión ya registrada');
      return;
    }

    try {
      await addDoc(collection(db, 'meditacionesRegistro'), {
        userId: currentUser.uid,
        fecha: new Date().toISOString(),
        meditacionId: meditacionId,
      });
      setSesionRegistrada((prev) => ({ ...prev, [meditacionId]: true }));

      // Recargar registros y estadísticas
      const q = query(
        collection(db, 'meditacionesRegistro'),
        where('userId', '==', currentUser.uid),
        orderBy('fecha', 'desc')
      );
      const regSnap = await getDocs(q);
      const regData = [];
      regSnap.forEach((doc) => regData.push({ id: doc.id, ...doc.data() }));
      setRegistros(regData);

      const ahora = new Date();
      const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      const semanaInicio = new Date(ahora);
      semanaInicio.setDate(ahora.getDate() - ahora.getDay());
      semanaInicio.setHours(0, 0, 0, 0);
      const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      let hoyCount = 0, semanaCount = 0, mesCount = 0;
      regData.forEach((reg) => {
        const fechaReg = new Date(reg.fecha);
        if (fechaReg >= hoyInicio) hoyCount++;
        if (fechaReg >= semanaInicio) semanaCount++;
        if (fechaReg >= mesInicio) mesCount++;
      });
      setEstadisticas({ hoy: hoyCount, semana: semanaCount, mes: mesCount });

      console.log('🧘 Sesión registrada automáticamente');
    } catch (err) {
      console.error('Error al registrar sesión:', err);
    }
  };

  const formatDate = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <div style={{ padding: theme.space[8], textAlign: 'center' }}>Cargando meditaciones...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.font.size.xxl, fontWeight: theme.font.weight.emphasis, marginBottom: theme.space[2] }}>🪷 Meditaciones</h2>
      <p style={{ color: theme.colors.textSecondary, marginBottom: theme.space[6] }}>
        Escucha y registra tus sesiones (se registran automáticamente al reproducir).
      </p>

      {currentUser && (
        <Card style={{ marginBottom: theme.space[6] }}>
          <h3 style={{ marginBottom: theme.space[3], color: theme.colors.textPrimary }}>📊 Tu práctica</h3>
          <div style={{ display: 'flex', gap: theme.space[4], flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: theme.font.size.xl, fontWeight: theme.font.weight.emphasis, color: theme.colors.accentPrimary }}>{estadisticas.hoy}</div>
              <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>Hoy</div>
            </div>
            <div>
              <div style={{ fontSize: theme.font.size.xl, fontWeight: theme.font.weight.emphasis, color: theme.colors.accentSecondary }}>{estadisticas.semana}</div>
              <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>Esta semana</div>
            </div>
            <div>
              <div style={{ fontSize: theme.font.size.xl, fontWeight: theme.font.weight.emphasis, color: theme.colors.accentCalm }}>{estadisticas.mes}</div>
              <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>Este mes</div>
            </div>
          </div>
        </Card>
      )}

      {currentUser && registros.length > 0 && (
        <Card style={{ marginBottom: theme.space[6] }}>
          <h4 style={{ marginBottom: theme.space[2], color: theme.colors.textPrimary }}>📜 Últimas sesiones</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {registros.slice(0, 5).map((reg) => (
              <li key={reg.id} style={{ padding: `${theme.space[2]} 0`, borderBottom: `1px solid ${theme.colors.border}` }}>
                {formatDate(reg.fecha)}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[4] }}>
        {meditaciones.length === 0 ? (
          <p>No hay meditaciones disponibles.</p>
        ) : (
          meditaciones.map((med) => (
            <Card key={med.id}>
              <h3 style={{ color: theme.colors.textPrimary, marginBottom: theme.space[1] }}>{med.title}</h3>
              <p style={{ color: theme.colors.textSecondary, marginBottom: theme.space[3] }}>{med.description}</p>
              <audio
                controls
                src={med.url}
                style={{ width: '100%', borderRadius: theme.radius.button }}
                onPlay={() => handlePlay(med.id)}
                onError={(e) => {
                  console.error('❌ Error al cargar audio:', med.url, e);
                  alert(`No se pudo cargar el audio: ${med.title}. Verifica la URL en Firebase.`);
                }}
              >
                Tu navegador no soporta el reproductor de audio.
              </audio>
              {sesionRegistrada[med.id] && (
                <div style={{ marginTop: theme.space[2], fontSize: theme.font.size.sm, color: theme.colors.accentCalm }}>
                  ✅ Sesión registrada
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: theme.space[6] }}>
        ← Volver al menú
      </Button>
    </div>
  );
};

export default MeditacionesPage;