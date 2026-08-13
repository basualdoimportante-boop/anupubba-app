// src/components/Recommendations.jsx
function Recommendations({ testId, score, maxScore }) {
  const mbsrLink = 'https://palousemindfulness.com/es/index.html';

  const getRecommendations = () => {
    // WHO-5
    if (testId === 'who5') {
      if (score <= 12) {
        return {
          level: 'bajo',
          color: '#d32f2f',
          message: '⚠️ Tu bienestar es bajo. Es importante que tomes acción.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (incluye meditaciones guiadas)', url: mbsrLink },
            { text: '📘 **Explora el curso:** En la página principal, ve a "Meditaciones" y "Archivos de lectura"', url: null },
            { text: '📞 **Apoyo profesional:** Llama al **4141** (atención psicológica gratuita 24/7)', url: null }
          ]
        };
      } else if (score <= 17) {
        return {
          level: 'moderado',
          color: '#f57c00',
          message: '🟡 Tu bienestar es moderado. Puedes mejorarlo con pequeños hábitos.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (ideal para principiantes)', url: mbsrLink },
            { text: '📘 **Recursos:** En la página principal, encuentra meditaciones guiadas y artículos', url: null },
            { text: '📝 **Práctica recomendada:** Diario de gratitud', url: null }
          ]
        };
      } else {
        return {
          level: 'alto',
          color: '#2e7d32',
          message: '🟢 Bienestar alto. ¡Sigue así! Mantén tus hábitos saludables.',
          actions: [
            { text: '🧘 **Profundiza tu práctica con el curso MBSR** (gratis)', url: mbsrLink },
            { text: '📘 **Artículos avanzados:** Disponibles en la sección "Archivos de lectura"', url: null },
            { text: '📈 **Monitorea tu evolución:** Sigue completando tests', url: null }
          ]
        };
      }
    }

    // PHQ-9
    if (testId === 'phq9') {
      if (score <= 4) {
        return {
          level: 'minimo',
          color: '#2e7d32',
          message: '🟢 Depresión mínima. Sigue cuidando tu salud mental.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (prevención)', url: mbsrLink },
            { text: '📘 **Explora meditaciones guiadas en la página principal**', url: null }
          ]
        };
      } else if (score <= 9) {
        return {
          level: 'leve',
          color: '#f57c00',
          message: '🟡 Depresión leve. Monitorea tu estado y considera apoyo.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (reduce síntomas depresivos)', url: mbsrLink },
            { text: '📞 **Línea de apoyo:** 4141 (atención psicológica gratuita 24/7)', url: null },
            { text: '📘 **Artículos de apoyo:** En "Archivos de lectura"', url: null }
          ]
        };
      } else if (score <= 14) {
        return {
          level: 'moderado',
          color: '#d32f2f',
          message: '🟠 Depresión moderada. Considera buscar apoyo profesional.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (recurso complementario)', url: mbsrLink },
            { text: '📞 **Línea de apoyo:** 4141 (atención psicológica gratuita 24/7)', url: null },
            { text: '🏥 **Consulta profesional:** Busca un psicólogo o psiquiatra', url: null }
          ]
        };
      } else {
        return {
          level: 'severo',
          color: '#b71c1c',
          message: '🔴 Depresión severa. Es importante que busques ayuda profesional inmediata.',
          actions: [
            { text: '🚨 **URGENTE:** Llama al **4141** (atención psicológica gratuita 24/7)', url: null },
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (consulta con tu terapeuta antes)', url: mbsrLink },
            { text: '🏥 **Consulta profesional inmediata:** Busca un psicólogo o psiquiatra', url: null }
          ]
        };
      }
    }

    // 👇 NUEVO: PSS-10
    if (testId === 'pss10') {
      if (score <= 13) {
        return {
          level: 'bajo',
          color: '#2e7d32',
          message: '🟢 Estrés bajo. Tienes un buen manejo del estrés.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (para mantener el equilibrio)', url: mbsrLink },
            { text: '📘 **Explora meditaciones guiadas en la página principal**', url: null }
          ]
        };
      } else if (score <= 20) {
        return {
          level: 'moderado',
          color: '#f57c00',
          message: '🟡 Estrés moderado. Considera incorporar técnicas de relajación.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (reduce el estrés)', url: mbsrLink },
            { text: '🌬️ **Ejercicio de respiración:** Prueba la respiración 4-7-8', url: null },
            { text: '📘 **Artículos de apoyo:** En "Archivos de lectura"', url: null }
          ]
        };
      } else if (score <= 27) {
        return {
          level: 'alto',
          color: '#d32f2f',
          message: '🟠 Estrés alto. Es importante que busques apoyo para manejar el estrés.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (recurso complementario)', url: mbsrLink },
            { text: '📞 **Línea de apoyo:** 4141 (atención psicológica gratuita 24/7)', url: null },
            { text: '🏃 **Actividad física:** Camina 15-20 minutos al día', url: null }
          ]
        };
      } else {
        return {
          level: 'muy_alto',
          color: '#b71c1c',
          message: '🔴 Estrés muy alto. Es importante que busques apoyo profesional.',
          actions: [
            { text: '📞 **Línea de apoyo:** 4141 (atención psicológica gratuita 24/7)', url: null },
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (consulta con tu terapeuta antes)', url: mbsrLink },
            { text: '🏥 **Consulta profesional inmediata:** Busca un psicólogo o psiquiatra', url: null }
          ]
        };
      }
    }

    // 👇 NUEVO: GAD-7
    if (testId === 'gad7') {
      if (score <= 4) {
        return {
          level: 'minimo',
          color: '#2e7d32',
          message: '🟢 Ansiedad mínima. Sigue cuidando tu salud mental.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (prevención)', url: mbsrLink },
            { text: '📘 **Explora meditaciones guiadas en la página principal**', url: null }
          ]
        };
      } else if (score <= 9) {
        return {
          level: 'leve',
          color: '#f57c00',
          message: '🟡 Ansiedad leve. Monitorea tu estado y practica técnicas de relajación.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (reduce la ansiedad)', url: mbsrLink },
            { text: '🌬️ **Ejercicio de respiración:** Prueba la respiración 4-7-8', url: null },
            { text: '📘 **Artículos de apoyo:** En "Archivos de lectura"', url: null }
          ]
        };
      } else if (score <= 14) {
        return {
          level: 'moderado',
          color: '#d32f2f',
          message: '🟠 Ansiedad moderada. Considera buscar apoyo profesional.',
          actions: [
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (recurso complementario)', url: mbsrLink },
            { text: '📞 **Línea de apoyo:** 4141 (atención psicológica gratuita 24/7)', url: null },
            { text: '🏃 **Actividad física:** Camina 15-20 minutos al día', url: null }
          ]
        };
      } else {
        return {
          level: 'severo',
          color: '#b71c1c',
          message: '🔴 Ansiedad severa. Es importante que busques ayuda profesional inmediata.',
          actions: [
            { text: '📞 **Línea de apoyo:** 4141 (atención psicológica gratuita 24/7)', url: null },
            { text: '🧘 **Curso MBSR gratis de 8 semanas** (consulta con tu terapeuta antes)', url: mbsrLink },
            { text: '🏥 **Consulta profesional inmediata:** Busca un psicólogo o psiquiatra', url: null }
          ]
        };
      }
    }

    // Fallback
    return {
      level: 'info',
      color: '#6C63FF',
      message: '📊 Recomendaciones disponibles pronto.',
      actions: [
        { text: '🧘 **Curso MBSR gratis de 8 semanas** (reducción de estrés)', url: mbsrLink },
        { text: '📘 **Explora meditaciones guiadas y artículos**', url: null }
      ]
    };
  };

  const rec = getRecommendations();

  return (
    <div style={{
      marginTop: '20px',
      padding: '15px',
      border: `2px solid ${rec.color}`,
      borderRadius: '8px',
      backgroundColor: `${rec.color}10`
    }}>
      <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: rec.color }}>
        {rec.message}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
        {rec.actions.map((action, index) => (
          <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '8px' }}>•</span>
            {action.url ? (
              <a 
                href={action.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#6C63FF', textDecoration: 'underline' }}
              >
                <span dangerouslySetInnerHTML={{ __html: action.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </a>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: action.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;