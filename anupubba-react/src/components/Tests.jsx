import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { actualizarRacha, completarMision } from '../services/gamificationService';

const TEST_COLLECTION = 'testResults';

const FREQUENCY_DAYS = {
  who5: 7,
  phq9: 14,
  pss10: 30,
  gad7: 14,
};

const TEST_QUESTIONS = {
  who5: {
    title: 'Bienestar general',
    items: [
      'Me he sentido alegre y de buen humor',
      'Me he sentido tranquilo/a y relajado/a',
      'Me he sentido activo/a y con energía',
      'He despertado descansado/a y con energía',
      'Mi vida diaria ha estado llena de cosas que me interesan',
    ],
    options: [
      'En ningún momento',
      'Poco tiempo',
      'Menos de la mitad del tiempo',
      'Más de la mitad del tiempo',
      'La mayor parte del tiempo',
      'Todo el tiempo',
    ],
    invertidos: [],
  },
  pss10: {
    title: 'Estrés percibido',
    items: [
      '¿...te has sentido afectado/a por algo que ocurrió inesperadamente?',
      '¿...te has sentido incapaz de controlar las cosas importantes de tu vida?',
      '¿...te has sentido nervioso/a o estresado/a?',
      '¿...te has sentido seguro/a de tu capacidad para manejar tus problemas personales?',
      '¿...has sentido que las cosas te salían como esperabas?',
      '¿...has sentido que no podías afrontar todas las cosas que tenías que hacer?',
      '¿...has podido controlar las dificultades de tu vida?',
      '¿...has sentido que tenías todo bajo control?',
      '¿...te has enfadado porque cosas que pasaron estaban fuera de tu control?',
      '¿...has sentido que las dificultades se acumulaban tanto que no podías superarlas?',
    ],
    options: ['Nunca', 'Casi nunca', 'De vez en cuando', 'A menudo', 'Muy a menudo'],
    invertidos: [3, 4, 6, 7],
  },
  phq9: {
    title: 'Estado de ánimo',
    items: [
      'Poco interés o placer en hacer cosas',
      'Sentirse decaído/a, deprimido/a o sin esperanzas',
      'Dificultad para dormir o dormir demasiado',
      'Sentirse cansado/a o con poca energía',
      'Poco apetito o comer en exceso',
      'Sentirse mal consigo mismo/a o que es un fracasado/a',
      'Dificultad para concentrarse en cosas como leer o ver TV',
      'Moverse o hablar tan lento que otros lo notan, o al contrario: inquietud/agitación',
      'Pensamientos de que estarías mejor muerto o de lastimarte de alguna manera',
    ],
    options: ['Ningún día', 'Varios días', 'Más de la mitad de los días', 'Casi todos los días'],
    invertidos: [],
  },
  gad7: {
    title: 'Ansiedad generalizada',
    items: [
      'Sentirse nervioso/a, ansioso/a o al borde',
      'Dificultad para controlar las preocupaciones',
      'Preocuparse demasiado por cosas diferentes',
      'Sentirse inquieto/a o con dificultad para relajarse',
      'Sentirse tan inquieto/a que no podías quedarte quieto/a',
      'Sentirse irritable o con mal humor',
      'Miedo de que algo terrible pudiera ocurrir',
    ],
    options: ['Ningún día', 'Varios días', 'Más de la mitad de los días', 'Casi todos los días'],
    invertidos: [],
  },
};

const Tests = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [preguntas, setPreguntas] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [invertidos, setInvertidos] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [puntajeTotal, setPuntajeTotal] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mostrarCrisis, setMostrarCrisis] = useState(false);

  useEffect(() => {
    const testConfig = TEST_QUESTIONS[testId];
    if (!testConfig) {
      setError('Test no encontrado');
      setLoading(false);
      return;
    }

    setPreguntas(testConfig.items);
    setOpciones(testConfig.options);
    setInvertidos(testConfig.invertidos || []);
    setRespuestas(new Array(testConfig.items.length).fill(null));

    if (currentUser) {
      const fetchHistorial = async () => {
        try {
          const q = query(
            collection(db, TEST_COLLECTION),
            where('userId', '==', currentUser.uid),
            where('testType', '==', testId),
            where('version', '==', 'v2'),
            orderBy('fecha', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const resultados = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            resultados.push({
              fecha: data.fecha,
              puntaje: data.puntaje,
            });
          });
          setHistorico(resultados);

          if (resultados.length > 0) {
            const ultimo = new Date(resultados[0].fecha);
            const ahora = new Date();
            const diffDias = (ahora - ultimo) / (1000 * 60 * 60 * 24);
            const diasMinimos = FREQUENCY_DAYS[testId] || 7;
            if (diffDias < diasMinimos) {
              const diasRestantes = Math.ceil(diasMinimos - diffDias);
              setError(
                `Ya realizaste este test hace ${Math.floor(diffDias)} días. Debes esperar ${diasRestantes} día(s) más.`
              );
              setLoading(false);
              return;
            }
          }
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Error al cargar historial');
          setLoading(false);
        }
      };
      fetchHistorial();
    } else {
      setLoading(false);
    }
  }, [testId, currentUser]);

  const handleRespuesta = (valor) => {
    const nuevas = [...respuestas];
    nuevas[indiceActual] = valor;
    setRespuestas(nuevas);
  };

  const handleSiguiente = () => {
    if (respuestas[indiceActual] === null) {
      alert('Por favor selecciona una opción');
      return;
    }
    if (indiceActual < preguntas.length - 1) {
      setIndiceActual(indiceActual + 1);
    } else {
      let total = 0;
      respuestas.forEach((resp, idx) => {
        if (invertidos.includes(idx)) {
          const maxValor = opciones.length - 1;
          total += (maxValor - resp);
        } else {
          total += resp;
        }
      });
      setPuntajeTotal(total);

      if (testId === 'phq9' && respuestas[8] >= 1) {
        setMostrarCrisis(true);
        return;
      }

      guardarResultado(total);
    }
  };

  const guardarResultado = async (puntaje) => {
    if (!currentUser) {
      setPuntajeTotal(puntaje);
      return;
    }

    setEnviando(true);
    try {
      await addDoc(collection(db, TEST_COLLECTION), {
        userId: currentUser.uid,
        testType: testId,
        fecha: new Date().toISOString(),
        puntaje: puntaje,
        version: 'v2',
        respuestas: respuestas,
      });

      // 🏅 ACTUALIZAR RACHA Y MISIONES
      await actualizarRacha(currentUser.uid, 'tests');
      
      // Verificar si es el primer test (contar cuántos tests ha hecho)
      const q = query(
        collection(db, TEST_COLLECTION),
        where('userId', '==', currentUser.uid),
        where('version', '==', 'v2')
      );
      const snapshot = await getDocs(q);
      const totalTests = snapshot.size;
      
      if (totalTests === 1) {
        await completarMision(currentUser.uid, 'primer_test');
      }
      if (totalTests >= 3) {
        await completarMision(currentUser.uid, 'tres_tests');
      }

      const nuevoHistorial = [
        { fecha: new Date().toISOString(), puntaje: puntaje },
        ...historico,
      ];
      setHistorico(nuevoHistorial);
      setEnviando(false);
      setPuntajeTotal(puntaje);
    } catch (err) {
      console.error(err);
      alert('Error al guardar el resultado');
      setEnviando(false);
    }
  };

  const handleVolver = () => {
    navigate('/tests');
  };

  const handleSalirSinResponder = () => {
    if (window.confirm(
      "🧘 Recuerda que este test es una herramienta para ti, no una obligación.\n\n" +
      "Si en este momento no te sientes con la disposición o energía para responder con honestidad, " +
      "puedes volver a intentarlo cuando te sientas más conectada/o contigo misma/o.\n\n" +
      "¿Quieres salir ahora y regresar más tarde?"
    )) {
      navigate('/tests');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
  if (error) {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>⛔ {error}</h2>
        <button onClick={handleVolver} style={{ marginTop: '20px', padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Volver a tests
        </button>
      </div>
    );
  }

  if (mostrarCrisis) {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>🆘 Contención de crisis</h2>
        <p style={{ fontSize: '18px' }}>Si estás pasando por un momento difícil, no estás solo/a.</p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#6C63FF' }}>Llama al 4141</p>
        <p>Línea de atención psicológica gratuita 24/7 en Chile.</p>
        <button onClick={handleVolver} style={{ marginTop: '20px', padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Volver a tests
        </button>
      </div>
    );
  }

  if (puntajeTotal !== null) {
    const nombreTest = TEST_QUESTIONS[testId]?.title || testId;
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <h2>✅ Resultado: {nombreTest}</h2>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#6C63FF' }}>Puntaje: {puntajeTotal}</p>
        <p>Gracias por completar el test.</p>

        {historico.length > 0 && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #ddd', paddingTop: '16px' }}>
            <h3>📊 Historial de este test</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {historico.map((item, idx) => (
                <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontWeight: 'bold' }}>{new Date(item.fecha).toLocaleDateString()}</span>
                  {' → '} Puntaje: <strong>{item.puntaje}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={handleVolver} style={{ marginTop: '24px', padding: '12px 24px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          ← Volver a tests
        </button>
      </div>
    );
  }

  const preguntaActual = preguntas[indiceActual];
  const totalPreguntas = preguntas.length;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>{TEST_QUESTIONS[testId]?.title}</h2>
        <span style={{ background: '#f0eeff', padding: '4px 12px', borderRadius: '20px', color: '#6C63FF' }}>
          {indiceActual + 1} / {totalPreguntas}
        </span>
      </div>

      <div style={{ background: '#f0f4ff', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #6C63FF' }}>
        <p style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: '#1a1a2e' }}>{preguntaActual}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {opciones.map((opt, idx) => {
          const valor = idx;
          const isSelected = respuestas[indiceActual] === valor;
          return (
            <button
              key={idx}
              onClick={() => handleRespuesta(valor)}
              style={{
                padding: '14px 18px',
                border: isSelected ? '3px solid #6C63FF' : '2px solid #e0e0e0',
                borderRadius: '12px',
                background: isSelected ? '#e8e4ff' : '#ffffff',
                color: '#1a1a2e',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '16px',
                fontWeight: isSelected ? '600' : '400',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(108, 99, 255, 0.25)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = '#f5f3ff';
                  e.currentTarget.style.borderColor = '#b8b0ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={handleSiguiente}
          style={{
            flex: 1,
            padding: '14px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#5a52e0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#6C63FF'}
        >
          {indiceActual === totalPreguntas - 1 ? 'Finalizar' : 'Siguiente →'}
        </button>
        <button
          onClick={handleSalirSinResponder}
          style={{
            padding: '14px 24px',
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#e53e3e'}
        >
          ✨ Prefiero no responder ahora
        </button>
      </div>
    </div>
  );
};

export default Tests;