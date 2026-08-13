import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testsData, setTestsData] = useState({});
  const [error, setError] = useState('');

  // Nombres amigables para cada test
  const testNames = {
    who5: 'Bienestar general',
    pss10: 'Estrés percibido',
    phq9: 'Estado de ánimo',
    gad7: 'Ansiedad generalizada',
  };

  // Función para generar resumen textual cálido
  const generarResumen = (puntajes, testId) => {
    if (puntajes.length < 2) {
      return 'Este es tu primer registro. ¡Sigue así!';
    }

    const actual = puntajes[0];
    const anterior = puntajes[1];

    // Para tests donde puntaje alto es mejor (WHO-5)
    const mejorEsAlto = testId === 'who5';
    const diferencia = actual - anterior;

    if (mejorEsAlto) {
      if (diferencia > 0) {
        return `✨ Tu ${testNames[testId]} ha mejorado. ¡Sigue cultivando tu bienestar!`;
      } else if (diferencia < 0) {
        return `🌱 Notamos un cambio en tu ${testNames[testId]}. Recuerda que es normal tener altibajos.`;
      } else {
        return `📊 Tu ${testNames[testId]} se mantiene estable. ¡Buen trabajo!`;
      }
    } else {
      // Para tests donde puntaje bajo es mejor (PSS-10, PHQ-9, GAD-7)
      if (diferencia < 0) {
        return `✨ Tu ${testNames[testId]} ha disminuido. ¡Sigue así, vas por buen camino!`;
      } else if (diferencia > 0) {
        return `🌱 Notamos un cambio en tu ${testNames[testId]}. Recuerda pedir apoyo si lo necesitas.`;
      } else {
        return `📊 Tu ${testNames[testId]} se mantiene estable. ¡Sigue cuidándote!`;
      }
    }
  };

  // Obtener historial del usuario (solo versiones v2)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'testResults'),
          where('userId', '==', currentUser.uid),
          where('version', '==', 'v2'),
          orderBy('fecha', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const results = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const testType = data.testType;
          if (!results[testType]) {
            results[testType] = [];
          }
          results[testType].push({
            fecha: data.fecha,
            puntaje: data.puntaje,
          });
        });
        setTestsData(results);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar historial');
        setLoading(false);
      }
    };
    fetchHistory();
  }, [currentUser]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando historial...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  const hasData = Object.keys(testsData).length > 0;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>📊 Mi historial</h2>
      <p style={{ color: '#555' }}>Aquí puedes ver la evolución de tus tests.</p>

      {!hasData && (
        <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
          No tienes registros aún. Realiza un test para empezar a ver tu historial.
        </p>
      )}

      {Object.keys(testsData).map((testId) => {
        const registros = testsData[testId];
        if (registros.length === 0) return null;

        // Tomar solo los últimos 7 registros para el gráfico
        const ultimos = registros.slice(0, 7);
        const puntajes = ultimos.map((r) => r.puntaje);
        const fechas = ultimos.map((r) => new Date(r.fecha).toLocaleDateString());

        // Calcular máximo y mínimo para el gráfico (escala suave)
        const maxVal = Math.max(...puntajes);
        const minVal = Math.min(...puntajes);
        const rango = maxVal - minVal || 1;

        // Resumen
        const resumen = generarResumen(puntajes, testId);

        // Determinar si el test es "bueno" con puntaje alto (WHO-5) o bajo (resto)
        const mejorEsAlto = testId === 'who5';

        // Nombres de categorías cualitativas para el eje Y
        const categorias = mejorEsAlto
          ? ['Más difícil', 'Regular', 'Más liviano']
          : ['Más liviano', 'Regular', 'Más difícil'];

        return (
          <div
            key={testId}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              marginTop: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#6C63FF' }}>
              {testNames[testId] || testId}
            </h3>

            {/* Resumen textual */}
            <p style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>
              {resumen}
            </p>

            {/* Gráfico de barras horizontales (simple) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {ultimos.map((item, idx) => {
                const barWidth = ((item.puntaje - minVal) / rango) * 100;
                const barColor = mejorEsAlto
                  ? item.puntaje >= (maxVal - minVal) * 0.6
                    ? '#6C63FF'
                    : '#e53e3e'
                  : item.puntaje <= (maxVal - minVal) * 0.4
                  ? '#6C63FF'
                  : '#e53e3e';

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#888', minWidth: '60px' }}>
                      {fechas[idx]}
                    </span>
                    <div style={{ flex: 1, background: '#f0f0f0', borderRadius: '8px', height: '20px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          background: barColor,
                          borderRadius: '8px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Eje Y cualitativo (solo si hay al menos 2 registros) */}
            {ultimos.length >= 2 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#888' }}>
                <span>{categorias[0]}</span>
                <span>{categorias[1]}</span>
                <span>{categorias[2]}</span>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          background: '#6C63FF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        ← Volver al Dashboard
      </button>
    </div>
  );
};

export default History;