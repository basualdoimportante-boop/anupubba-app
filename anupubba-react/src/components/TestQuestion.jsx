// src/components/TestQuestion.jsx
import { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { hashUserId } from '../utils/hash';

function TestQuestion({ testId, testName, questions, onComplete, onCancel, isGuest }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  const currentQuestion = questions[currentIndex];

  const handleBack = () => onCancel();

  const handleNext = async () => {
    if (selectedOption === null) {
      alert('Por favor, selecciona una respuesta antes de continuar.');
      return;
    }

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // Crisis PHQ-9
    if (testId === 'phq9' && newAnswers.length === 9) {
      const item9 = newAnswers[8];
      if (item9 >= 1) {
        try {
          await addDoc(collection(db, 'crisisEvents'), {
            testId: 'phq9',
            timestamp: serverTimestamp()
          });
        } catch (err) {
          console.error('Error al registrar evento de crisis:', err);
        }
        onComplete(newAnswers);
        return;
      }
    }

    // Si es invitado, no guardar
    if (isGuest) {
      onComplete(newAnswers);
      return;
    }

    // Guardar en Firestore
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Debes iniciar sesión para guardar tus resultados.');
        onComplete(newAnswers);
        return;
      }

      const userIdHash = await hashUserId(user.uid);
      const batch = writeBatch(db);
      const collectionRef = collection(db, 'testResults');

      newAnswers.forEach((itemValue, index) => {
        const docRef = doc(collectionRef);
        batch.set(docRef, {
          userId: user.uid,
          userIdHash: userIdHash,
          sessionId: sessionId,
          testId: testId,
          testName: testName,
          itemIndex: index,
          itemValue: itemValue,
          timestamp: serverTimestamp()
        });
      });

      await batch.commit();
      alert('✅ Test guardado correctamente.');
      onComplete(newAnswers);
    } catch (error) {
      console.error('Error al guardar el test:', error);
      alert(`❌ Error al guardar: ${error.message}`);
      onComplete(newAnswers);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>📝 {testName}</h2>

      <div style={{
        padding: '10px 14px',
        background: '#f0f7ff',
        borderRadius: '6px',
        borderLeft: '4px solid #6C63FF',
        fontSize: '0.95rem',
        color: '#333',
        marginBottom: '10px'
      }}>
        💡 <strong>Si no te sientes seguro de responder, puedes volver atrás.</strong> No se guardará tu progreso.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <button
          onClick={handleBack}
          style={{
            padding: '6px 14px',
            background: 'transparent',
            color: '#6C63FF',
            border: '1px solid #6C63FF',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← Volver atrás
        </button>
      </div>

      <p>Pregunta {currentIndex + 1} de {questions.length}</p>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{currentQuestion.text}</p>
        {currentQuestion.options.map((option, idx) => (
          <label key={idx} style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="radio"
              name="question"
              value={idx}
              checked={selectedOption === idx}
              onChange={() => setSelectedOption(idx)}
            />
            {option}
          </label>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={isSubmitting}
        style={{
          padding: '10px 20px',
          background: '#6C63FF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1
        }}
      >
        {isSubmitting ? 'Guardando...' : currentIndex + 1 === questions.length ? 'Finalizar' : 'Siguiente →'}
      </button>
    </div>
  );
}

export default TestQuestion;