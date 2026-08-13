import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function NeuroLesson() {
  const { moduleId } = useParams(); // Obtiene el ID del módulo desde la URL
  const navigate = useNavigate();
  
  const [module, setModule] = useState(null); // Datos del módulo
  const [currentSlide, setCurrentSlide] = useState(0); // Slide actual
  const [showChallenge, setShowChallenge] = useState(false); // ¿Mostrar desafío?
  const [challengeAnswer, setChallengeAnswer] = useState(null); // Respuesta del usuario
  const [feedback, setFeedback] = useState(null); // Mensaje de correcto/incorrecto
  const [loading, setLoading] = useState(true); // Pantalla de carga
  const [error, setError] = useState(null); // Mensajes de error

  // Cargar datos del módulo desde Firestore
  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'neuroModules', moduleId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setModule({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Módulo no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el módulo: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadModule();
  }, [moduleId]);

  // Función para avanzar a la siguiente slide
  const nextSlide = () => {
    if (!module) return;
    
    if (currentSlide < module.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setFeedback(null);
    } else if (!showChallenge) {
      // Si llegó al final de las slides, mostrar desafío
      setShowChallenge(true);
      setChallengeAnswer(null);
      setFeedback(null);
    }
  };

  // Función para volver a la slide anterior
  const prevSlide = () => {
    if (showChallenge) {
      setShowChallenge(false);
      return;
    }
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setFeedback(null);
    }
  };

  // Verificar respuesta del desafío
  const checkAnswer = () => {
    if (!module || !module.challenge) return;
    
    const challenge = module.challenge;
    let isCorrect = false;

    switch (challenge.type) {
      case 'multiple-choice':
      case 'true-false':
        // Para opción múltiple y verdadero/falso: comparar con correctAnswer
        isCorrect = challengeAnswer === challenge.correctAnswer;
        break;
      case 'match':
        // Para match: verificar si todas las parejas son correctas
        if (typeof challengeAnswer === 'object') {
          isCorrect = JSON.stringify(challengeAnswer) === JSON.stringify(challenge.correctPairs);
        }
        break;
      case 'fill-blank':
        // Para completar espacio: comparar texto (ignorando mayúsculas/minúsculas)
        isCorrect = challengeAnswer && 
                   challengeAnswer.toLowerCase().trim() === challenge.correctAnswer.toLowerCase().trim();
        break;
      default:
        break;
    }

    if (isCorrect) {
      setFeedback({ type: 'success', message: challenge.successMessage || '¡Correcto! Has comprendido el concepto.' });
      saveProgress(true);
    } else {
      setFeedback({ type: 'error', message: challenge.errorMessage || 'No es correcto. Intenta de nuevo.' });
    }
  };

  // Guardar progreso en Firestore
  const saveProgress = async (completed) => {
    if (!auth.currentUser) {
      setFeedback({ type: 'info', message: 'Inicia sesión para guardar tu progreso.' });
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const progressDoc = doc(db, 'neuroProgress', `${userId}_${moduleId}`);
      
      const docSnap = await getDoc(progressDoc);
      const existingData = docSnap.exists() ? docSnap.data() : {
        userId,
        moduleId,
        xpEarned: 0,
        completedAt: null,
        attempts: 0
      };

      await setDoc(progressDoc, {
        ...existingData,
        completed: completed,
        xpEarned: completed ? module.xpReward : existingData.xpEarned,
        completedAt: completed ? new Date().toISOString() : existingData.completedAt,
        attempts: existingData.attempts + 1,
        lastAttemptAt: new Date().toISOString()
      });

      if (completed) {
        setFeedback({ 
          type: 'success', 
          message: `¡Felicitaciones! Ganaste ${module.xpReward} XP. Progreso guardado.` 
        });
      }
    } catch (err) {
      console.error('Error guardando progreso:', err);
    }
  };

  // Función para volver a la página de módulos
  const goBack = () => {
    navigate('/neuro');
  };

  // Renderizar desafío según su tipo
  const renderChallenge = () => {
    if (!module || !module.challenge) return null;
    
    const challenge = module.challenge;

    switch (challenge.type) {
      case 'multiple-choice':
        return (
          <div className="challenge-options">
            <p className="challenge-question">{challenge.question}</p>
            {challenge.options.map((option, index) => (
              <button
                key={index}
                className={`challenge-btn ${challengeAnswer === option ? 'selected' : ''}`}
                onClick={() => setChallengeAnswer(option)}
                disabled={feedback && feedback.type === 'success'}
              >
                {option}
              </button>
            ))}
            <button 
              className="submit-btn"
              onClick={checkAnswer}
              disabled={!challengeAnswer || (feedback && feedback.type === 'success')}
            >
              Verificar respuesta
            </button>
          </div>
        );

      case 'true-false':
        return (
          <div className="challenge-options">
            <p className="challenge-question">{challenge.question}</p>
            <div className="true-false-buttons">
              <button
                className={`challenge-btn ${challengeAnswer === true ? 'selected' : ''}`}
                onClick={() => setChallengeAnswer(true)}
                disabled={feedback && feedback.type === 'success'}
              >
                Verdadero
              </button>
              <button
                className={`challenge-btn ${challengeAnswer === false ? 'selected' : ''}`}
                onClick={() => setChallengeAnswer(false)}
                disabled={feedback && feedback.type === 'success'}
              >
                Falso
              </button>
            </div>
            <button 
              className="submit-btn"
              onClick={checkAnswer}
              disabled={challengeAnswer === null || (feedback && feedback.type === 'success')}
            >
              Verificar respuesta
            </button>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="challenge-options">
            <p className="challenge-question">{challenge.question}</p>
            <input
              type="text"
              className="fill-blank-input"
              placeholder="Escribe tu respuesta..."
              value={challengeAnswer || ''}
              onChange={(e) => setChallengeAnswer(e.target.value)}
              disabled={feedback && feedback.type === 'success'}
            />
            <button 
              className="submit-btn"
              onClick={checkAnswer}
              disabled={!challengeAnswer || (feedback && feedback.type === 'success')}
            >
              Verificar respuesta
            </button>
          </div>
        );

      default:
        return <p>Tipo de desafío no soportado</p>;
    }
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div className="neuro-lesson-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Cargando lección...</p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="neuro-lesson-container">
        <div className="error-screen">
          <p>❌ {error}</p>
          <button className="primary-btn" onClick={goBack}>Volver</button>
        </div>
      </div>
    );
  }

  // Si no hay módulo
  if (!module) {
    return null;
  }

  // Pantalla principal de lección
  return (
    <div className="neuro-lesson-container">
      {/* Barra superior */}
      <div className="lesson-header">
        <button className="back-btn" onClick={goBack}>← Volver</button>
        <div className="lesson-progress">
          {showChallenge ? (
            <span>Desafío final</span>
          ) : (
            <span>Slide {currentSlide + 1} de {module.slides.length}</span>
          )}
        </div>
        {module.xpReward && <div className="xp-badge">{module.xpReward} XP</div>}
      </div>

      {/* Contenido principal */}
      <div className="lesson-content">
        {!showChallenge ? (
          // Mostrar slide actual
          <div className="slide-container">
            <div className="slide-content">
              {module.slides[currentSlide].image && (
                <img 
                  src={module.slides[currentSlide].image} 
                  alt="Ilustración" 
                  className="slide-image"
                />
              )}
              <h2 className="slide-title">{module.slides[currentSlide].title}</h2>
              <p className="slide-text">{module.slides[currentSlide].content}</p>
              {module.slides[currentSlide].tip && (
                <div className="tip-box">
                  <span className="tip-icon">💡</span>
                  <p className="tip-text">{module.slides[currentSlide].tip}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Mostrar desafío
          <div className="challenge-container">
            <h2 className="challenge-title">🧠 Pon a prueba lo aprendido</h2>
            <p className="challenge-description">{module.challenge.description}</p>
            {renderChallenge()}
          </div>
        )}

        {/* Mensaje de feedback */}
        {feedback && (
          <div className={`feedback-message feedback-${feedback.type}`}>
            <p>{feedback.message}</p>
          </div>
        )}
      </div>

      {/* Navegación inferior */}
      <div className="lesson-navigation">
        <button 
          className="nav-btn"
          onClick={prevSlide}
          disabled={currentSlide === 0 && !showChallenge}
        >
          Anterior
        </button>
        
        {!showChallenge && currentSlide < module.slides.length - 1 && (
          <button className="nav-btn primary" onClick={nextSlide}>
            Siguiente
          </button>
        )}
        
        {!showChallenge && currentSlide === module.slides.length - 1 && (
          <button className="nav-btn primary" onClick={nextSlide}>
            Ir al desafío
          </button>
        )}
        
        {showChallenge && feedback && feedback.type === 'success' && (
          <button className="nav-btn primary" onClick={goBack}>
            Completar lección
          </button>
        )}
      </div>
    </div>
  );
}

export default NeuroLesson;
