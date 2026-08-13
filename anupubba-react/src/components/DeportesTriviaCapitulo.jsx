import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { actualizarRacha, completarMision } from '../services/gamificationService';

const DeportesTriviaCapitulo = () => {
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
          collection(db, 'deportesTrivia'),
          where('chapterId', '==', chapterId)
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
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setQuestions(selected);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las preguntas');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [chapterId]);

  const handleOptionClick = (optionIndex) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
        if (score + (isCorrect ? 1 : 0) >= 7 && currentUser) {
          actualizarRacha(currentUser.uid, 'aprendizaje')
            .then(() => completarMision(currentUser.uid, 'primer_modulo'))
            .catch(err => console.error(err));
        }
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
        <h2>Resultado - Deportes</h2>
        <p>Acertaste {score} de {questions.length} preguntas.</p>
        <p>{passed ? '🎉 ¡Felicidades! Has aprobado el capítulo.' : '😅 No alcanzaste el 70%. ¡Inténtalo de nuevo!'}</p>
        <button onClick={handleRestart} style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}>
          Intentar de nuevo
        </button>
        <button onClick={() => navigate('/deportes')} style={{ padding: '10px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Volver a Deportes
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Trivia - Deportes</h2>
      <p>Pregunta {currentIndex + 1} de {questions.length}</p>
      <p style={{ fontSize: '18px', fontWeight: '500' }}>{currentQ.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(idx)}
            disabled={selectedOption !== null}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              backgroundColor: selectedOption !== null && idx === currentQ.correctAnswer ? '#28a745' :
                              selectedOption === idx ? '#dc3545' : '#f0f0f0',
              color: selectedOption !== null && (idx === currentQ.correctAnswer || idx === selectedOption) ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: selectedOption !== null ? 'default' : 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      {selectedOption !== null && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
          <p>{selectedOption === currentQ.correctAnswer ? '✅ Correcto' : '❌ Incorrecto'}</p>
          <p>{currentQ.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default DeportesTriviaCapitulo;