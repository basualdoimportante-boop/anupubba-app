import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import Button from './Button';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceArea, ReferenceLine, ResponsiveContainer, Dot
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================
// CONFIGURACIÓN POR TEST (colores intensos y orden corregido)
// ============================================================
const FREQUENCY_DAYS = {
  who5: 7,
  phq9: 14,
  pss10: 30,
  gad7: 14,
};

// Paleta de colores intensos
const ZONE_COLORS = {
  green: '#1b7a34',    // zona buena / baja
  yellow: '#f9a825',   // zona moderada
  orange: '#e65100',   // zona alta / severa
  red: '#b71c1c',      // zona crítica
  purple: '#4a148c',   // zona intermedia (para algunos tests)
};

const TEST_CONFIG = {
  who5: {
    label: 'Bienestar general',
    subtitle: 'Últimos 14 días',
    max: 25,
    higherIsBetter: true,
    accent: '#1a237e', // azul oscuro para contraste
    // ORDEN: de abajo (malo) a arriba (bueno) para que la línea suba en mejora
    zones: [
      { min: 0, max: 12, label: '🔴 A atender', color: ZONE_COLORS.red },
      { min: 13, max: 17, label: '🟠 Moderado', color: ZONE_COLORS.orange },
      { min: 18, max: 25, label: '🟢 Bueno', color: ZONE_COLORS.green },
    ],
    thresholds: [{ y: 12, label: 'Umbral de atención' }],
  },
  phq9: {
    label: 'Estado de ánimo',
    subtitle: 'Últimas 2 semanas',
    max: 27,
    higherIsBetter: false,
    accent: '#1a237e',
    // ORDEN: de abajo (bueno) a arriba (malo) para que la línea suba en empeoramiento
    zones: [
      { min: 0, max: 4, label: '🟢 Mínimo', color: ZONE_COLORS.green },
      { min: 5, max: 9, label: '🟣 Leve', color: ZONE_COLORS.purple },
      { min: 10, max: 14, label: '🟠 Moderado', color: ZONE_COLORS.orange },
      { min: 15, max: 19, label: '🟠 Moderadamente severo', color: ZONE_COLORS.orange },
      { min: 20, max: 27, label: '🔴 Severo', color: ZONE_COLORS.red },
    ],
    thresholds: [],
    crisisNote: true,
  },
  pss10: {
    label: 'Estrés percibido',
    subtitle: 'Último mes',
    max: 40,
    higherIsBetter: false,
    accent: '#1a237e',
    zones: [
      { min: 0, max: 13, label: '🟢 Bajo', color: ZONE_COLORS.green },
      { min: 14, max: 20, label: '🟠 Moderado', color: ZONE_COLORS.orange },
      { min: 21, max: 27, label: '🟠 Alto', color: ZONE_COLORS.orange },
      { min: 28, max: 40, label: '🔴 Muy alto', color: ZONE_COLORS.red },
    ],
    thresholds: [],
  },
  gad7: {
    label: 'Ansiedad',
    subtitle: 'Últimas 2 semanas',
    max: 21,
    higherIsBetter: false,
    accent: '#1a237e',
    zones: [
      { min: 0, max: 4, label: '🟢 Mínima', color: ZONE_COLORS.green },
      { min: 5, max: 9, label: '🟣 Leve', color: ZONE_COLORS.purple },
      { min: 10, max: 14, label: '🟠 Moderada', color: ZONE_COLORS.orange },
      { min: 15, max: 21, label: '🔴 Severa', color: ZONE_COLORS.red },
    ],
    thresholds: [{ y: 10, label: 'Umbral clínico' }],
  },
};

// ============================================================
// UTILIDADES
// ============================================================
const getZone = (config, score) => {
  return config.zones.find(z => score >= z.min && score <= z.max) || config.zones[0];
};

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
};

const getTrend = (data, higherIsBetter) => {
  if (data.length < 2) return null;
  const latest = data[data.length - 1].score;
  const previous = data[data.length - 2].score;
  const diff = latest - previous;
  if (diff === 0) return { icon: Minus, color: theme.colors.textSecondary, text: 'Sin cambio' };
  const improving = higherIsBetter ? diff > 0 : diff < 0;
  return {
    icon: improving ? TrendingUp : TrendingDown,
    color: improving ? ZONE_COLORS.green : ZONE_COLORS.red,
    text: `${diff > 0 ? '+' : ''}${diff} vs. anterior`,
  };
};

const getResumen = (data, config) => {
  if (data.length === 0) return 'Aún no tienes registros de este test.';
  if (data.length === 1) return 'Este es tu primer registro. ¡Sigue así!';
  const trend = getTrend(data, config.higherIsBetter);
  if (!trend) return `📊 Tu ${config.label} se mantiene estable.`;
  if (trend.icon === Minus) return `📊 Tu ${config.label} se mantiene estable.`;
  if (trend.icon === TrendingUp && config.higherIsBetter) {
    return `✨ Tu ${config.label} ha mejorado. ¡Sigue cultivando tu bienestar!`;
  }
  if (trend.icon === TrendingDown && !config.higherIsBetter) {
    return `✨ Tu ${config.label} ha disminuido. ¡Sigue así!`;
  }
  if (trend.icon === TrendingDown && config.higherIsBetter) {
    return `🌱 Notamos un cambio en tu ${config.label}. Recuerda que es normal tener altibajos.`;
  }
  if (trend.icon === TrendingUp && !config.higherIsBetter) {
    return `🌱 Tu ${config.label} ha aumentado. Revisa tus herramientas de regulación.`;
  }
  return `📊 Tu ${config.label} se mantiene en la zona ${getZone(config, data[data.length-1].score).label}.`;
};

// ============================================================
// SUBCOMPONENTE: GRÁFICO INDIVIDUAL
// ============================================================
const TestHistoryChart = ({ testType, data, onNavigate }) => {
  const config = TEST_CONFIG[testType];
  const [showHistory, setShowHistory] = useState(false);

  const sorted = useMemo(
    () => [...data].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [data]
  );
  const last = sorted[sorted.length - 1];
  const lastZone = last ? getZone(config, last.score) : null;
  const trend = getTrend(sorted, config.higherIsBetter);
  const resumen = getResumen(sorted, config);
  const nextAvailable = last ? FREQUENCY_DAYS[testType] : 0;

  if (sorted.length === 0) {
    return (
      <div style={cardStyle}>
        <Header config={config} />
        <div style={{ padding: '20px 0', textAlign: 'center', color: theme.colors.textSecondary, fontSize: 14 }}>
          🫥 Aún no hay respuestas registradas.
        </div>
        <Button onClick={() => onNavigate(testType)} style={{ marginTop: 8 }}>
          Realizar test ahora
        </Button>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <Header config={config} />

      {/* Último puntaje + zona + trend */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '4px 0 8px' }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: lastZone?.color || theme.colors.textPrimary }}>
          {last.score}
        </span>
        <span style={{ fontSize: 14, color: theme.colors.textSecondary }}>
          / {config.max} · {lastZone?.label || ''}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {trend && (
            <>
              <trend.icon size={16} color={trend.color} />
              <span style={{ fontSize: 12, fontWeight: 600, color: trend.color }}>{trend.text}</span>
            </>
          )}
        </div>
      </div>

      {/* Resumen textual */}
      <div style={{
        background: '#f5f5ff',
        padding: '8px 12px',
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 14,
        color: theme.colors.textPrimary,
        borderLeft: `4px solid ${lastZone?.color || theme.colors.accentPrimary}`,
      }}>
        {resumen}
      </div>

      {/* Banner de crisis (si aplica) */}
      {testType === 'phq9' && last?.crisisFlag && (
        <div style={{
          background: '#ffebee',
          border: `2px solid ${ZONE_COLORS.red}`,
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 10,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <AlertTriangle size={18} color={ZONE_COLORS.red} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 14, color: ZONE_COLORS.red }}>
            <strong>⚠️ Necesitas apoyo?</strong> Llama o envía un mensaje al <strong>*4141</strong> (atención psicológica gratuita 24/7).
          </div>
        </div>
      )}

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={sorted} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${testType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.accent || theme.colors.accentPrimary} stopOpacity={0.35} />
              <stop offset="100%" stopColor={config.accent || theme.colors.accentPrimary} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Zonas de fondo */}
          {config.zones.map((z, i) => (
            <ReferenceArea
              key={i}
              y1={z.min}
              y2={z.max}
              fill={z.color}
              fillOpacity={0.3}
              stroke={z.color}
              strokeWidth={0.8}
              strokeOpacity={0.6}
            />
          ))}
          {config.thresholds.map((t, i) => (
            <ReferenceLine
              key={i}
              y={t.y}
              stroke={theme.colors.textSecondary}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: t.label,
                position: 'insideTopRight',
                fill: theme.colors.textSecondary,
                fontSize: 10,
              }}
            />
          ))}

          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            tick={{ fontSize: 10, fill: theme.colors.textSecondary }}
            axisLine={false}
            tickLine={false}
            minTickGap={20}
          />
          <YAxis
            domain={[0, config.max]}
            tick={{ fontSize: 10, fill: theme.colors.textSecondary }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const p = payload[0].payload;
                const zone = getZone(config, p.score);
                return (
                  <div style={{
                    background: theme.colors.surface,
                    border: `2px solid ${zone.color}`,
                    borderRadius: 10,
                    padding: '8px 12px',
                    boxShadow: theme.shadow.card,
                    color: theme.colors.textPrimary,
                  }}>
                    <div style={{ fontWeight: 600 }}>{fmtDate(p.date)}</div>
                    <div style={{ fontWeight: 700, color: zone.color }}>{p.score} / {config.max}</div>
                    <div style={{ fontSize: 12, color: theme.colors.textSecondary }}>{zone.label}</div>
                    {p.crisisFlag && <div style={{ color: ZONE_COLORS.red, fontWeight: 600 }}>⚠️ Ítem 9 positivo</div>}
                  </div>
                );
              }
              return null;
            }}
          />

          <Area
            type="monotone"
            dataKey="score"
            stroke={config.accent || theme.colors.accentPrimary}
            strokeWidth={3}
            fill={`url(#grad-${testType})`}
            dot={(props) => {
              const z = getZone(config, props.payload.score);
              return <Dot {...props} r={6} fill={z.color} stroke={theme.colors.surface} strokeWidth={2} />;
            }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: theme.colors.surface }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Leyenda de zonas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
        {config.zones.map((z, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: theme.colors.textSecondary }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: z.color, display: 'inline-block' }} />
            {z.label}
          </div>
        ))}
      </div>

      {/* Botón "Ver historial" (colapsable) */}
      <button
        onClick={() => setShowHistory(s => !s)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 12,
          background: 'none',
          border: 'none',
          color: theme.colors.textSecondary,
          fontSize: 13,
          cursor: 'pointer',
          padding: '8px 0',
          width: '100%',
          borderTop: `1px solid ${theme.colors.border}`,
          justifyContent: 'center',
        }}
      >
        {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Historial de respuestas ({sorted.length})
      </button>

      {showHistory && (
        <div style={{ marginTop: 6, maxHeight: 160, overflowY: 'auto' }}>
          {[...sorted].reverse().map((r, i) => {
            const z = getZone(config, r.score);
            return (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 2px',
                borderBottom: `1px solid ${theme.colors.border}`,
                fontSize: 12,
              }}>
                <span style={{ color: theme.colors.textSecondary }}>{fmtDate(r.date)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, display: 'inline-block' }} />
                  <span style={{ fontWeight: 600 }}>{r.score}</span>
                  <span style={{ color: theme.colors.textSecondary }}>{z.label}</span>
                  {r.crisisFlag && <AlertTriangle size={12} color={ZONE_COLORS.red} />}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Botón "Realizar test ahora" */}
      <Button
        onClick={() => onNavigate(testType)}
        style={{ marginTop: 12 }}
      >
        📝 Realizar test ahora
      </Button>

      {/* Próxima fecha disponible */}
      {nextAvailable > 0 && (
        <div style={{ marginTop: 6, fontSize: 11, color: theme.colors.textSecondary, textAlign: 'center' }}>
          ⏳ Puedes repetir este test cada {nextAvailable} días.
        </div>
      )}
    </div>
  );
};

// ============================================================
// HEADER
// ============================================================
const Header = ({ config }) => (
  <div style={{ marginBottom: 2 }}>
    <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.textPrimary }}>{config.label}</div>
    <div style={{ fontSize: 12, color: theme.colors.textSecondary }}>{config.subtitle}</div>
  </div>
);

// ============================================================
// ESTILOS (usando theme.js)
// ============================================================
const cardStyle = {
  background: theme.colors.surface,
  borderRadius: theme.radius.card,
  padding: '16px 18px 12px',
  boxShadow: theme.shadow.card,
  border: `1px solid ${theme.colors.border}`,
};

// ============================================================
// COMPONENTE PRINCIPAL: History (conexión a Firestore)
// ============================================================
const History = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [allResults, setAllResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          orderBy('fecha', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const results = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const testType = data.testType;
          if (!results[testType]) results[testType] = [];
          results[testType].push({
            date: data.fecha,
            score: data.puntaje,
            crisisFlag: data.crisisFlag || false,
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

  const handleNavigate = (testType) => {
    navigate(`/tests/${testType}`);
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: theme.colors.textSecondary }}>Cargando historial...</div>;
  }
  if (error) {
    return <div style={{ padding: 40, textAlign: 'center', color: theme.colors.red }}>{error}</div>;
  }

  const hasData = Object.keys(allResults).some((key) => allResults[key].length > 0);

  if (!hasData) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, textAlign: 'center' }}>
        <h2 style={{ color: theme.colors.textPrimary }}>📊 Historial de tests</h2>
        <p style={{ color: theme.colors.textSecondary, marginTop: 20 }}>
          No tienes registros aún. Realiza tus primeros tests para comenzar a ver tu evolución.
        </p>
        <Button onClick={() => navigate('/tests')} style={{ marginTop: 20 }}>
          Ir a tests
        </Button>
        <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: 12 }}>
          ← Volver al menú
        </Button>
      </div>
    );
  }

  const testOrder = ['who5', 'phq9', 'pss10', 'gad7'];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <h2 style={{ color: theme.colors.textPrimary, marginBottom: 4 }}>📊 Mi historial de bienestar</h2>
      <p style={{ color: theme.colors.textSecondary, marginBottom: 24 }}>
        Evolución de tus tests. Arriba siempre significa mejora.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20,
      }}>
        {testOrder.map((testId) => (
          <TestHistoryChart
            key={testId}
            testType={testId}
            data={allResults[testId] || []}
            onNavigate={handleNavigate}
          />
        ))}
      </div>

      <Button variant="secondary" onClick={() => navigate('/dashboard')} style={{ marginTop: 24 }}>
        ← Volver al menú
      </Button>
    </div>
  );
};

export default History;