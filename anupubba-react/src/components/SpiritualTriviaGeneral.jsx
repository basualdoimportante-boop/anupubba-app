// src/components/SpiritualTriviaGeneral.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function SpiritualTriviaGeneral() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'caminosTrivia'));
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        const shuffled = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setTotalQuestions(shuffled.length);
      } catch (error) {
        console.error('Error al cargar preguntas:', error);
      } finally {
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
    if (selectedOption === null && !answered) {
      alert('Por favor, selecciona una respuesta antes de continuar.');
      return;
    }

    if (!answered) {
      const current = questions[currentIndex];
      const isCorrect = selectedOption === current.correct;
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

  const resetTrivia = () => {
    const shuffled = questions.sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando preguntas...</div>;
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No hay preguntas disponibles para la trivia.</p>
        <button
          onClick={() => navigate('/games')}
          style={{
            padding: '10px 20px',
            background: '#6C63FF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Volver a Juegos
        </button>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    let emoji = '';
    if (percentage >= 80) {
      message = '¡Excelente! Eres un experto en caminos espirituales.';
      emoji = '🧠';
    } else if (percentage >= 60) {
      message = '¡Bien hecho! Sigue aprendiendo.';
      emoji = '💪';
    } else if (percentage >= 40) {
      message = 'Vas por buen camino. Repasa los módulos.';
      emoji = '📖';
    } else {
      message = 'No te desanimes. Vuelve a leer los capítulos y prueba de nuevo.';
      emoji = '🧘';
    }

    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>🎯 Resultado de la Trivia</h2>
        <div style={{
          background: '#f9f9f9',
          padding: '30px',
          borderRadius: '12px',
          margin: '20px 0'
        }}>
          <p style={{ fontSize: '3rem', margin: 0 }}>{emoji}</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
            {score} / {totalQuestions}
          </p>
          <p style={{ fontSize: '1.2rem' }}>{message}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={resetTrivia}
            style={{
              padding: '10px 20px',
              background: '#6C63FF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Jugar de nuevo
          </button>
          <button
            onClick={() => navigate('/games')}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#6C63FF',
              border: '2px solid #6C63FF',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ← Volver a Juegos
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const isMultiple = current.type === 'multiple-choice';
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  let displayOptions = [];
  if (isMultiple && Array.isArray(current.options)) {
    displayOptions = current.options;
  } else if (!isMultiple) {
    displayOptions = ['Verdadero', 'Falso'];
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>🌀 Trivia de Caminos Espirituales</h2>
        <span style={{ color: '#888' }}>
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div style={{
        width: '100%',
        height: '6px',
        background: '#eee',
        borderRadius: '3px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: '#6C63FF',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      <div style={{
        padding: '20px',
        background: '#f9f9f9',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <p style={{ fontSize: '1.1rem', margin: '0 0 15px 0' }}>
          {current.question}
        </p>

        {displayOptions.length === 0 ? (
          <p style={{ color: 'red' }}>⚠️ No hay opciones disponibles.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayOptions.map((option, idx) => {
              const optionValue = isMultiple ? idx : (idx === 0);
              let buttonStyle = {
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                cursor: answered ? 'default' : 'pointer',
                backgroundColor: '#ffffff',
                textAlign: 'left',
                fontSize: '1rem',
                transition: 'all 0.2s',
                color: '#000000'
              };

              if (answered) {
                if (optionValue === current.correct) {
                  buttonStyle.border = '2px solid #2e7d32';
                  buttonStyle.backgroundColor = '#e8f5e9';
                } else if (selectedOption === optionValue && optionValue !== current.correct) {
                  buttonStyle.border = '2px solid #c62828';
                  buttonStyle.backgroundColor = '#ffebee';
                }
              } else if (selectedOption === optionValue) {
                buttonStyle.border = '2px solid #6C63FF';
                buttonStyle.backgroundColor = '#f0f4ff';
              }

              return (
                <button
                  key={idx}
                  style={buttonStyle}
                  onClick={() => handleOptionClick(optionValue)}
                  disabled={answered}
                >
                  <span style={{ color: '#000000', fontWeight: 'bold' }}>
                    {isMultiple ? `${String.fromCharCode(65 + idx)}. ${option}` : option}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        style={{
          width: '100%',
          padding: '12px',
          background: '#6C63FF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        {!answered ? 'Verificar respuesta' : currentIndex + 1 === totalQuestions ? 'Ver resultados' : 'Siguiente →'}
      </button>
    </div>
  );
}

export default SpiritualTriviaGeneral;