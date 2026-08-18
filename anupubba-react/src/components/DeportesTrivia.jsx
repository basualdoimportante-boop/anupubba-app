import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { theme } from '../theme';
import Button from './Button';

const DeportesTrivia = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'deportesTrivia'));
        const allQuestions = [];
        querySnapshot.forEach((doc) => {
          allQuestions.push({ id: doc.id, ...doc.data() });
        });
        if (allQuestions.length === 0) {
          setError('No hay preguntas disponibles.');
          setLoading(false);
          return;
        }
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setQuestions(selected);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar preguntas:', err);
        setError('Error al cargar las preguntas.');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionClick = (optionIndex) => {
    if (answered) return;
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      alert('Selecciona una respuesta antes de continuar.');
      return;
    }

    if (!answered) {
      const current = questions[currentIndex];
      const isCorrect = selectedOption === current.correctAnswer;
      if (isCorrect) setScore(score + 1);
      setAnswered(true);
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (loading) {
    return <div style={{ padding: theme.space[8], textAlign: 'center' }}>Cargando preguntas...</div>;
  }

  if (error) {
    return <div style={{ padding: theme.space[8], textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (questions.length === 0) {
    return <div style={{ padding: theme.space[8], textAlign: 'center' }}>No hay preguntas disponibles.</div>;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let emoji = '';
    if (percentage >= 80) {
      message = '¡Excelente! Eres un experto en deportes.';
      emoji = '🏆';
    } else if (percentage >= 60) {
      message = '¡Bien hecho! Sigue aprendiendo.';
      emoji = '💪';
    } else if (percentage >= 40) {
      message = 'Vas por buen camino. Repasa los capítulos.';
      emoji = '📖';
    } else {
      message = 'No te desanimes. Vuelve a leer los capítulos y prueba de nuevo.';
      emoji = '🧘';
    }

    return (
      <div style={{ maxWidth: '600px', margin: `${theme.space[8]} auto`, padding: theme.space[4], textAlign: 'center' }}>
        <h2 style={{ color: theme.colors.textPrimary }}>🎯 Resultado de la Trivia</h2>
        <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[6], margin: `${theme.space[4]} 0`, boxShadow: theme.shadow.card }}>
          <p style={{ fontSize: '3rem', margin: 0 }}>{emoji}</p>
          <p style={{ fontSize: '2rem', fontWeight: theme.font.weight.emphasis, margin: `${theme.space[2]} 0` }}>
            {score} / {questions.length}
          </p>
          <p style={{ fontSize: '1.2rem' }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: theme.space[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button onClick={handleRestart}>🔄 Jugar de nuevo</Button>
          <Button variant="secondary" onClick={() => navigate('/juegos')}>← Volver a Juegos</Button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const isMultiple = current.type === 'multiple-choice';
  const progress = ((currentIndex + 1) / questions.length) * 100;

  let displayOptions = [];
  if (isMultiple && Array.isArray(current.options)) {
    displayOptions = current.options;
  } else if (!isMultiple) {
    displayOptions = ['Verdadero', 'Falso'];
  }

  return (
    <div style={{ maxWidth: '600px', margin: `${theme.space[8]} auto`, padding: theme.space[4] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.space[2] }}>
        <h2 style={{ color: theme.colors.textPrimary }}>🧠 Trivia de Deportes</h2>
        <span style={{ color: theme.colors.textSecondary }}>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', marginBottom: theme.space[4] }}>
        <div style={{ width: `${progress}%`, height: '100%', background: theme.colors.accentPrimary, borderRadius: '3px', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ background: theme.colors.surface, borderRadius: theme.radius.card, padding: theme.space[4], marginBottom: theme.space[4], boxShadow: theme.shadow.card }}>
        <p style={{ fontSize: '1.1rem', marginBottom: theme.space[4] }}>{current.question}</p>

        {displayOptions.length === 0 ? (
          <p style={{ color: 'red' }}>⚠️ No hay opciones disponibles.</p>
        ) : (
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
                <button
                  key={idx}
                  style={buttonStyle}
                  onClick={() => handleOptionClick(optionValue)}
                  disabled={answered}
                >
                  <span style={{ color: theme.colors.textPrimary }}>
                    {isMultiple ? `${String.fromCharCode(65 + idx)}. ${option}` : option}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Button onClick={handleNext} style={{ marginTop: theme.space[3] }}>
        {!answered ? 'Verificar respuesta' : currentIndex + 1 === questions.length ? 'Ver resultados' : 'Siguiente →'}
      </Button>
    </div>
  );
};

export default DeportesTrivia;