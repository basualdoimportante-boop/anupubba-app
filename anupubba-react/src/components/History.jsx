import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Area
} from 'recharts';

// ============================================================
// CONFIGURACIÓN DE TESTS
// ============================================================
const TEST_CONFIG = {
  who5: {
    label: 'Bienestar general',
    color: '#6C63FF',
    // Franjas: [inicio, fin, color, etiqueta]
    bands: [
      { min: 0, max: 12, color: '#ff6b6b', label: 'A atender' },
      { min: 13, max: 17, color: '#ffd93d', label: 'Moderado' },
      { min: 18, max: 25, color: '#6bcb77', label: 'Bueno' },
    ],
    maxScore: 25,
    // Quién tiene puntaje alto = bueno
    higherIsBetter: true,
    // Mensajes para resumen
    messages: {
      improving: '✨ Tu bienestar general ha mejorado. ¡Sigue así!',
      stable: '📊 Tu bienestar se mantiene estable.',
      declining: '🌱 Notamos un cambio. Revisa tus hábitos de autocuidado.',
      first: 'Este es tu primer registro. ¡Sigue cultivando tu bienestar!',
    },
  },
  pss10: {
    label: 'Estrés percibido',
    color: '#f97316',
    bands: [
      { min: 0, max: 13, color: '#6bcb77', label: 'Bajo' },
      { min: 14, max: 20, color: '#ffd93d', label: 'Moderado' },
      { min: 21, max: 27, color: '#ff9f43', label: 'Alto' },
      { min: 28, max: 40, color: '#ff6b6b', label: 'Muy alto' },
    ],
    maxScore: 40,
    higherIsBetter: false,
    messages: {
      improving: '✨ Tu nivel de estrés ha disminuido. ¡Sigue así!',
      stable: '📊 Tu estrés se mantiene estable.',
      declining: '🌱 Tu estrés ha aumentado. Considera revisar tus recomendaciones.',
      first: 'Este es tu primer registro de estrés. ¡Empieza a monitorearlo!',
    },
  },
  gad7: {
    label: 'Ansiedad',
    color: '#8b5cf6',
    bands: [
      { min: 0, max: 4, color: '#6bcb77', label: 'Mínima' },
      { min: 5, max: 9, color: '#ffd93d', label: 'Leve' },
      { min: 10, max: 14, color: '#ff9f43', label: 'Moderada' },
      { min: 15, max: 21, color: '#ff6b6b', label: 'Severa' },
    ],
    maxScore: 21,
    higherIsBetter: false,
    messages: {
      improving: '✨ Tu ansiedad ha disminuido. ¡Sigue así!',
      stable: '📊 Tu ansiedad se mantiene estable.',
      declining: '🌱 Tu ansiedad ha aumentado. Revisa tus herramientas de regulación.',
      first: 'Este es tu primer registro de ansiedad. ¡Empieza a monitorearla!',
    },
  },
  phq9: {
    label: 'Estado de ánimo',
    color: '#ec4899',
    bands: [
      { min: 0, max: 4, color: '#6bcb77', label: 'Mínima' },
      { min: 5, max: 9, color: '#ffd93d', label: 'Leve' },
      { min: 10, max: 14, color: '#ff9f43', label: 'Moderada' },
      { min: 15, max: 19, color: '#ff6b6b', label: 'Moderadamente severa' },
      { min: 20, max: 27, color: '#dc3545', label: 'Severa' },
    ],
    maxScore: 27,
    higherIsBetter: false,
    messages: {
      improving: '✨ Tu estado de ánimo ha mejorado. ¡Sigue así!',
      stable: '📊 Tu estado de ánimo se mantiene estable.',
      declining: '🌱 Notamos un cambio. Recuerda que pedir apoyo es un acto de cuidado.',
      first: 'Este es tu primer registro de estado de ánimo. ¡Empieza a monitorearlo!',
    },
  },
};

// ============================================================
// FUNCIONES DE CÁLCULO
// ============================================================

// Calcular promedio móvil de N puntos
const calcularPromedioMovil = (datos, ventana = 3) => {
  if (datos.length === 0) return [];
  if (datos.length < ventana) {
    // Si hay menos puntos que la ventana, usar todos
    return datos.map((d, i) => {
      const slice = datos.slice(0, i + 1);
      const avg = slice.reduce((sum, item) => sum + item.puntaje, 0) / slice.length;
      return { ...d, promedio: avg };
    });
  }

  const resultado = [];
  for (let i = 0; i < datos.length; i++) {
    const inicio = Math.max(0, i - ventana + 1);
    const slice = datos.slice(inicio, i + 1);
    const avg = slice.reduce((sum, item) => sum + item.puntaje, 0) / slice.length;
    resultado.push({ ...datos[i], promedio: avg });
  }
  return resultado;
};

// Invertir visualmente el eje Y (para tests donde bajo es mejor)
const invertirPuntaje = (puntaje, maxScore) => {
  return maxScore - puntaje;
};

// Determinar la banda de un puntaje
const getBandForScore = (puntaje, bands) => {
  for (const band of bands) {
    if (puntaje >= band.min && puntaje <= band.max) {
      return band;
    }
  }
  return bands[bands.length - 1];
};

// Generar resumen textual
const generarResumen = (datos, testId, testConfig) => {
  if (datos.length === 0) return testConfig.messages.first;
  if (datos.length === 1) return testConfig.messages.first;

  // Usar los últimos dos puntos para comparar
  const actual = datos[datos.length - 1].promedio || datos[datos.length - 1].puntaje;
  const anterior = datos[datos.length - 2].promedio || datos[datos.length - 2].puntaje;

  const diff = actual - anterior;

  // Para tests donde alto es mejor (WHO-5), diff positivo = mejora
  // Para tests donde bajo es mejor (resto), diff negativo = mejora
  const mejora = testConfig.higherIsBetter ? diff > 0 : diff < 0;

  if (Math.abs(diff) < 0.5) {
    return testConfig.messages.stable;
  } else if (mejora) {
    return testConfig.messages.improving;
  } else {
    return testConfig.messages.declining;
  }
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const History = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allResults, setAllResults] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) {
        setLoading(false);
        setError('Inicia sesión para ver tu historial.');
        return;
      }

      try {
        const q = query(
          collection(db, 'testResults'),
          where('userId', '==', currentUser.uid),
          where('version', '==', 'v2'),
          orderBy('fecha', 'asc') // Orden ascendente para gráfico
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
            formattedDate: new Date(data.fecha).toLocaleDateString('es-CL', {
              day: '2-digit',
              month: 'short',
            }),
          });
        });
        setAllResults(results);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar historial:', err);
        setError('Error al cargar el historial.');
        setLoading(false);
      }
    };
    fetchHistory();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Cargando historial...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );
  }

  const hasData = Object.keys(allResults).some((key) => allResults[key].length > 0);

  if (!hasData) {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>📊 Historial de tests</h2>
        <p style={{ color: '#888', marginTop: '20px' }}>
          No tienes registros aún. Realiza tus primeros tests para comenzar a ver tu evolución.
        </p>
        <button
          onClick={() => navigate('/tests')}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Ir a tests
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#2d3748', marginBottom: '4px' }}>📊 Mi historial de bienestar</h2>
      <p style={{ color: '#718096', marginBottom: '24px' }}>
        Evolución de tus tests. Arriba siempre significa mejora.
      </p>

      {/* Grid 2x2 para los 4 tests */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        {Object.keys(TEST_CONFIG).map((testId) => {
          const rawData = allResults[testId] || [];
          const config = TEST_CONFIG[testId];

          // Si no hay datos, mostrar placeholder
          if (rawData.length === 0) {
            return (
              <div
                key={testId}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '280px',
                }}
              >
                <h4 style={{ color: config.color, marginBottom: '8px' }}>
                  {config.label}
                </h4>
                <p style={{ color: '#aaa', fontSize: '14px' }}>
                  Aún no tienes registros de este test.
                </p>
                <button
                  onClick={() => navigate(`/tests/${testId}`)}
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    background: config.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Realizar test
                </button>
              </div>
            );
          }

          // Calcular promedio móvil
          const datosConPromedio = calcularPromedioMovil(rawData, 3);

          // Preparar datos para el gráfico
          let chartData = datosConPromedio.map((item) => {
            // Invertir visualmente si el test tiene high = malo
            const visualScore = config.higherIsBetter
              ? item.promedio
              : invertirPuntaje(item.promedio, config.maxScore);
            const rawVisualScore = config.higherIsBetter
              ? item.puntaje
              : invertirPuntaje(item.puntaje, config.maxScore);

            return {
              fecha: item.formattedDate,
              fechaRaw: item.fecha,
              promedio: visualScore,
              puntaje: rawVisualScore,
              // Guardar el puntaje real para las bandas
              realScore: item.puntaje,
            };
          });

          // Obtener la banda para el último punto
          const lastRealScore = rawData[rawData.length - 1].puntaje;
          const lastBand = getBandForScore(lastRealScore, config.bands);

          // Resumen
          const resumen = generarResumen(datosConPromedio, testId, config);

          return (
            <div
              key={testId}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h4 style={{ color: config.color, marginBottom: '4px' }}>
                {config.label}
              </h4>

              {/* Gráfico con recharts */}
              <div style={{ width: '100%', height: 160, marginTop: '8px', flexShrink: 0 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    {/* Franjas de fondo */}
                    {config.bands.map((band, idx) => {
                      // Para tests donde high es malo, invertir el rango visual
                      let minVisual = config.higherIsBetter ? band.min : config.maxScore - band.max;
                      let maxVisual = config.higherIsBetter ? band.max : config.maxScore - band.min;
                      // Asegurar orden
                      if (minVisual > maxVisual) {
                        [minVisual, maxVisual] = [maxVisual, minVisual];
                      }
                      return (
                        <ReferenceArea
                          key={idx}
                          y1={minVisual}
                          y2={maxVisual}
                          fill={band.color}
                          fillOpacity={0.3}
                          stroke="none"
                        />
                      );
                    })}

                    {/* Ejes */}
                    <XAxis
                      dataKey="fecha"
                      tick={{ fontSize: 10, fill: '#888' }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[0, config.maxScore]}
                      tick={false}
                      axisLine={false}
                      tickLine={false}
                      width={0}
                    />

                    {/* Tooltip personalizado */}
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const realScore = rawData.find(
                            (d) => d.formattedDate === data.fecha
                          )?.puntaje;
                          const band = getBandForScore(realScore, config.bands);
                          return (
                            <div
                              style={{
                                background: 'white',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                border: `2px solid ${band.color}`,
                              }}
                            >
                              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {data.fecha}
                              </div>
                              <div style={{ fontSize: '12px', color: '#555' }}>
                                {band.label}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* Línea de promedio móvil (principal) */}
                    <Line
                      type="monotone"
                      dataKey="promedio"
                      stroke={config.color}
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: config.color,
                        stroke: 'white',
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 7 }}
                      name="Promedio"
                    />

                    {/* Puntos individuales (tenues) */}
                    <Line
                      type="monotone"
                      dataKey="puntaje"
                      stroke={config.color}
                      strokeWidth={1}
                      strokeOpacity={0.3}
                      dot={{
                        r: 3,
                        fill: config.color,
                        stroke: 'white',
                        strokeWidth: 1,
                        opacity: 0.5,
                      }}
                      activeDot={false}
                      name="Mediciones individuales"
                      legendType="none"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Resumen textual */}
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: '#f9f9ff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#333',
                  borderLeft: `4px solid ${config.color}`,
                }}
              >
                {resumen}
              </div>

              {/* Indicador de última banda */}
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '11px',
                  color: '#888',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Última zona:</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '4px',
                    background: lastBand.color,
                  }}
                />
                <span>{lastBand.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón Volver al menú */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
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

export default History;