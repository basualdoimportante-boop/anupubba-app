import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import Button from './Button';
import { actualizarRacha, completarMision } from '../services/gamificationService';

const NeuroDesafioPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!chapterId) {
        setError('ID del capítulo no válido');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'neuroTrivia'),
          where('moduleId', '==', chapterId)
        );
        const querySnapshot = await getDocs(q);
        const allQuestions = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allQuestions.push({ id: doc.id, ...data, correctAnswer: data.correct });
        });
        if (allQuestions.length === 0) {
          setError('No hay preguntas para este capítulo');
          setLoading(false);
          return;
        }
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setQuestions(selected);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar preguntas:', err);
        setError('Error al cargar las preguntas');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [chapterId]);

  const handleOptionClick = (optionIndex) => {
    if (answered) return;
    setSelectedOption(optionIndex);
  };

  const handleVerify = () => {
    if (selectedOption === null) {
      alert('Selecciona una respuesta antes de verificar.');
      return;
    }
    const current = questions[currentIndex];
    const isCorrect = selectedOption === current.correctAnswer;
    if (isCorrect) setScore(score + 1);
    setShowExplanation(true);
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
      if (score >= 7 && currentUser) {
        guardarProgreso();
      }
    }
  };

  const guardarProgreso = async () => {
    try {
      const docRef = doc(db, 'neuroProgress', currentUser.uid);
      const docSnap = await getDoc(docRef);
      let data = docSnap.exists() ? docSnap.data() : { userId: currentUser.uid };
      data[chapterId] = { passed: true, score: score, fecha: new Date().toISOString() };
      await setDoc(docRef, data, { merge: true });
      console.log('✅ Progreso guardado en neuroProgress');

      // GAMIFICACIÓN
      await actualizarRacha(currentUser.uid, 'aprendizaje');
      const progressData = data;
      const completados = Object.keys(progressData).filter(key => key !== 'userId' && progressData[key].passed === true).length;
      if (completados === 1) {
        await completarMision(currentUser.uid, 'primer_modulo');
      }
      if (completados >= 3) {
        await completarMision(currentUser.uid, 'tres_modulos');
      }

      // Forzar recarga al volver al Dashboard
      navigate('/dashboard');
      window.location.reload();

    } catch (err) {
      console.error('Error al guardar progreso:', err);
      alert('Error al guardar el progreso. Intenta de nuevo.');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswered(false);
    setShowResult(false);
    setShowExplanation(false);
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
  };

  if (loading) return <div style={{ padding: theme.space[8], textAlign: 'center' }}>Cargando preguntas...</div>;
  if (error) return <div style={{ padding: theme.space[8], textAlign: 'center', color: 'red' }}>{error}</div>;
  if (questions.length === 0) return <div style={{ padding: theme.space[8], textAlign: 'center' }}>No hay preguntas disponibles.</div>;

  if (showResult) {
    const passed = score >= 7;
    return (
      <div style={{ maxWidth: '600px', margin: `${theme.space[8]} auto`, padding: theme.space[4], textAlign: 'center' }}>
        <h2 style={{ color: theme.colors.textPrimary }}>✅ Resultado - Neurociencias</h2>
        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[6], margin: `${theme.space[4]} 0`, boxShadow: theme.shadow.card }}>
          <p style={{ fontSize: '2rem', fontWeight: theme.font.weight.emphasis }}>{score} / {questions.length}</p>
          <p>{passed ? '🎉 ¡Felicidades! Has aprobado el capítulo.' : '😅 No alcanzaste el 70%. ¡Inténtalo de nuevo!'}</p>
        </div>
        <div style={{ display: 'flex', gap: theme.space[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button onClick={handleRestart}>🔄 Intentar de nuevo</Button>
          <Button variant="secondary" onClick={() => navigate('/neuro')}>← Volver a Neurociencias</Button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const isMultiple = current.type === 'multiple-choice';
  const progress = ((currentIndex + 1) / questions.length) * 100;

  let displayOptions = [];
  if (isMultiple && Array.isArray(current.options) && current.options.length > 0) {
    displayOptions = current.options;
  } else if (!isMultiple) {
    displayOptions = ['Verdadero', 'Falso'];
  } else {
    return (
      <div style={{ maxWidth: '600px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
        <h2 style={{ color: 'red' }}>Error en la pregunta</h2>
        <p>Esta pregunta no tiene opciones válidas.</p>
        <Button variant="secondary" onClick={() => navigate('/neuro')}>← Volver a Neurociencias</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.space[2] }}>
        <h2 style={{ color: theme.colors.textPrimary }}>🧠 Desafío - Neurociencias</h2>
        <span style={{ color: theme.colors.textSecondary }}>{currentIndex + 1} / {questions.length}</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', marginBottom: theme.space[4] }}>
        <div style={{ width: `${progress}%`, height: '100%', background: theme.colors.accentPrimary, borderRadius: '3px', transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[4], marginBottom: theme.space[4], boxShadow: theme.shadow.card }}>
        <p style={{ fontSize: '1.1rem', marginBottom: theme.space[4] }}>{current.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[2] }}>
          {displayOptions.map((option, idx) => {
            const optionValue = isMultiple ? idx : (idx === 0);
            let buttonStyle = {
              display: 'block',
              width: '100%',
              padding: theme.space[3],
              border: '2px solid #ddd',
              borderRadius: theme.radius.button,
              cursor: answered ? 'default' : 'pointer',
              backgroundColor: '#ffffff',
              textAlign: 'left',
              fontSize: theme.font.size.base,
              transition: 'all 0.2s',
            };
            if (answered) {
              if (optionValue === current.correctAnswer) {
                buttonStyle.border = '2px solid #2e7d32';
                buttonStyle.backgroundColor = '#e8f5e9';
              } else if (selectedOption === optionValue && optionValue !== current.correctAnswer) {
                buttonStyle.border = '2px solid #c62828';
                buttonStyle.backgroundColor = '#ffebee';
              }
            } else if (selectedOption === optionValue) {
              buttonStyle.border = `2px solid ${theme.colors.accentPrimary}`;
              buttonStyle.backgroundColor = '#f0eeff';
            }
            return (
              <button key={idx} style={buttonStyle} onClick={() => handleOptionClick(optionValue)} disabled={answered}>
                <span style={{ color: theme.colors.textPrimary }}>
                  {isMultiple ? `${String.fromCharCode(65 + idx)}. ${option}` : option}
                </span>
              </button>
            );
          })}
        </div>
        {showExplanation && (
          <div style={{ marginTop: theme.space[4], padding: theme.space[3], background: '#f9f9f9', borderRadius: theme.radius.card }}>
            <p style={{ color: selectedOption === current.correctAnswer ? '#2e7d32' : '#c62828' }}>
              {selectedOption === current.correctAnswer ? '✅ Correcto' : '❌ Incorrecto'}
            </p>
            <p style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>{current.explanation}</p>
          </div>
        )}
      </div>
      {!answered ? (
        <Button onClick={handleVerify}>Verificar respuesta</Button>
      ) : (
        <Button onClick={handleNext}>
          {currentIndex + 1 === questions.length ? 'Ver resultados' : 'Siguiente →'}
        </Button>
      )}
    </div>
  );
};

export default NeuroDesafioPage;