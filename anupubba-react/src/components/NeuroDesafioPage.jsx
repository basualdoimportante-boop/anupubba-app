import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

const NeuroDesafioPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          allQuestions.push({ id: doc.id, ...doc.data() });
        });
        if (allQuestions.length === 0) {
          setError('No hay preguntas para este capítulo');
          setLoading(false);
          return;
        }
        // Mezclar y seleccionar 10
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
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    const currentQ = questions[currentIndex];
    let isCorrect = false;
    if (currentQ.type === 'true-false') {
      // Para true-false, el campo 'correct' es booleano; comparamos con el índice seleccionado (0 o 1)
      isCorrect = (optionIndex === 0 ? true : false) === currentQ.correct;
    } else {
      // Para multiple-choice, 'correct' es el índice de la opción correcta
      isCorrect = optionIndex === currentQ.correct;
    }
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setQuestions(selected);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando preguntas...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (questions.length === 0) return <div style={{ padding: '40px', textAlign: 'center' }}>No hay preguntas disponibles.</div>;

  if (showResult) {
    const passed = score >= 7;
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>✅ Resultado - Neurociencias</h2>
        <p>Acertaste <strong>{score}</strong> de {questions.length} preguntas.</p>
        <p>{passed ? '🎉 ¡Felicidades! Has aprobado el capítulo.' : '😅 No alcanzaste el 70%. ¡Inténtalo de nuevo!'}</p>
        <button onClick={handleRestart} style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}>
          Intentar de nuevo
        </button>
        <button onClick={() => navigate('/neuro')} style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Volver a Neurociencias
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  // Determinar las opciones según el tipo
  let options = [];
  let isTrueFalse = false;
  if (currentQ.type === 'true-false') {
    isTrueFalse = true;
    options = ['Verdadero', 'Falso'];
  } else {
    options = currentQ.options || [];
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧠 Desafío - Neurociencias</h2>
      <p>Pregunta {currentIndex + 1} de {questions.length}</p>
      <p style={{ fontSize: '18px', fontWeight: '500' }}>{currentQ.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
        {options.map((opt, idx) => {
          // Determinar si esta opción es la correcta según el tipo
          let isCorrect = false;
          if (isTrueFalse) {
            isCorrect = (idx === 0 ? true : false) === currentQ.correct;
          } else {
            isCorrect = idx === currentQ.correct;
          }
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={selectedOption !== null}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                backgroundColor: selectedOption !== null && isCorrect ? '#28a745' :
                                selectedOption === idx && !isCorrect ? '#dc3545' :
                                selectedOption === idx ? '#6C63FF' : '#f0f0f0',
                color: selectedOption !== null && (isCorrect || selectedOption === idx) ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: selectedOption !== null ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selectedOption !== null && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
          <p>{currentQ.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default NeuroDesafioPage;