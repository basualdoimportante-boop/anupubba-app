const FREQUENCY_DAYS = {
  who5: 7,
  phq9: 14,
  pss10: 30,
  gad7: 14,
};

const TEST_NAMES = {
  who5: 'Bienestar general',
  phq9: 'Estado de ánimo',
  pss10: 'Estrés percibido',
  gad7: 'Ansiedad generalizada',
};

export const obtenerTestsDisponibles = (historial) => {
  const ahora = new Date();
  const disponibles = [];

  Object.keys(FREQUENCY_DAYS).forEach((testId) => {
    const registros = historial[testId] || [];
    if (registros.length === 0) {
      disponibles.push(testId);
    } else {
      const ultimo = new Date(registros[0].fecha);
      const diffDias = (ahora - ultimo) / (1000 * 60 * 60 * 24);
      if (diffDias >= FREQUENCY_DAYS[testId]) {
        disponibles.push(testId);
      }
    }
  });

  return disponibles;
};

export const generarListaHTML = (testsIds) => {
  if (testsIds.length === 0) {
    return '<p style="color: #555; font-style: italic; margin: 0;">No hay tests disponibles por ahora. ¡Vuelve pronto!</p>';
  }
  const items = testsIds.map((id) => 
    `<li style="padding: 8px 0; border-bottom: 1px solid #eaeaea; list-style: none; display: flex; align-items: center; gap: 8px;">
       <span style="color: #6C63FF;">✅</span>
       <span style="font-weight: 500;">${TEST_NAMES[id] || id}</span>
     </li>`
  ).join('');
  return `<ul style="padding: 0; margin: 0; background: #f9f9ff; border-radius: 12px; padding: 8px 16px;">${items}</ul>`;
};