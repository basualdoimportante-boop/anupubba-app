// src/components/SeedButton.jsx
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const modules = [
  {
    id: 'module1',
    title: 'Tu cerebro en 5 minutos',
    icon: '🌱',
    description: 'Los fundamentos del cerebro y cómo la meditación lo afecta.',
    requiredXP: 0,
    unlocked: true,
    lessons: [
      {
        id: 'm1l1',
        title: 'El cerebro no es un músculo, es una orquesta',
        slides: [{ type: 'text', content: 'El cerebro no trabaja como un músculo que se fortalece todo junto. Es más como una orquesta: cada sección tiene su papel. La meditación entrena a ciertos músicos, no a todos.' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Cuál es la mejor analogía para el cerebro?',
          options: ['Un solo músculo que se puede fortalecer', 'Una orquesta con varias secciones que trabajan juntas', 'Un computador con software fijo'],
          correct: 1,
          feedbackCorrect: '✅ Correcto. La orquesta es mejor analogía.',
          feedbackIncorrect: 'Casi. La mejor analogía es la de una orquesta.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l2',
        title: 'Las neuronas y las conexiones',
        slides: [{ type: 'text', content: 'Las neuronas son las células que procesan información. Se comunican a través de conexiones llamadas sinapsis.' }],
        challenge: {
          type: 'match',
          question: 'Empareja cada término con su analogía:',
          pairs: [{ left: 'Neurona', right: 'Músico' }, { left: 'Sinapsis', right: 'Partitura' }],
          feedbackCorrect: '✅ Así es.',
          feedbackIncorrect: 'Casi. Revisa: Neurona es el músico, Sinapsis es la partitura.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l3',
        title: 'Neuroplasticidad intro',
        slides: [{ type: 'text', content: 'La neuroplasticidad es la capacidad del cerebro para reorganizarse: crear nuevas conexiones y eliminar las que no usa. Esto pasa toda la vida.' }],
        challenge: {
          type: 'true-false',
          question: 'La neuroplasticidad solo ocurre en niños.',
          correct: false,
          feedbackCorrect: '✅ Correcto. Ocurre toda la vida.',
          feedbackIncorrect: '❌ Ocurre toda la vida.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l4',
        title: '¿Por qué meditar cambia el cerebro?',
        slides: [{ type: 'text', content: 'La meditación entrena la atención y la regulación emocional. Cada vez que vuelves la atención a la respiración, ejercitas la corteza prefrontal y calmas la amígdala.' }],
        challenge: {
          type: 'fill-blank',
          question: 'Cada vez que notás que tu mente divaga y la traés de vuelta, estás ejercitando la ___ prefrontal.',
          correct: 'corteza',
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ La respuesta es corteza.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l5',
        title: 'Mini-desafío final del módulo',
        slides: [{ type: 'text', content: 'Situación: llevas 10 días meditando 5 minutos cada día. Sientes que te cuesta menos volver a la respiración cuando te distraes. ¿Qué está pasando en tu cerebro?' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué está pasando en tu cerebro?',
          options: ['Estás creando nuevas neuronas en la amígdala.', 'Estás fortaleciendo la corteza prefrontal y calmando la amígdala.', 'Tu cerebro no ha cambiado, solo te estás relajando.'],
          correct: 1,
          feedbackCorrect: '✅ Exacto.',
          feedbackIncorrect: '❌ La respuesta correcta es B.',
          xp: 30,
          evidence: 'sólida'
        }
      }
    ]
  },
  {
    id: 'module2',
    title: 'Las 3 zonas clave',
    icon: '🎯',
    description: 'Amígdala, corteza prefrontal e ínsula: cómo se relacionan con la meditación.',
    requiredXP: 50,
    unlocked: false,
    lessons: [
      {
        id: 'm2l1',
        title: 'Amígdala: la alarma de miedo',
        slides: [{ type: 'text', content: 'Tenés una alarma de humo dentro del cerebro. Se llama amígdala. Su trabajo es detectar amenazas y disparar ansiedad.' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué pasa con la amígdala cuando meditás seguido?',
          options: ['Se agranda', 'Se vuelve menos reactiva', 'Desaparece'],
          correct: 1,
          feedbackCorrect: '✅ Exacto.',
          feedbackIncorrect: 'Casi. Se vuelve menos reactiva.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm2l2',
        title: 'Corteza prefrontal: el director de orquesta',
        slides: [{ type: 'text', content: 'La corteza prefrontal (CPF) es la zona que planifica, regula impulsos y sostiene la atención.' }],
        challenge: {
          type: 'true-false',
          question: 'La corteza prefrontal se fortalece con la práctica de meditación.',
          correct: true,
          feedbackCorrect: '✅ Sí.',
          feedbackIncorrect: '❌ Sí, se fortalece.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm2l3',
        title: 'Ínsula: el radar corporal',
        slides: [{ type: 'text', content: 'La ínsula es la zona que percibe las señales del cuerpo: respiración, latidos, tensión muscular.' }],
        challenge: {
          type: 'fill-blank',
          question: 'La ___ es la zona del cerebro que percibe las señales del cuerpo.',
          correct: 'ínsula',
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ La respuesta es ínsula.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm2l4',
        title: 'Desafío final: identifica las zonas',
        slides: [{ type: 'text', content: 'Identifica qué zona del cerebro se asocia con cada función.' }],
        challenge: {
          type: 'match',
          question: 'Empareja cada función con la zona correspondiente:',
          pairs: [
            { left: 'Detecta amenazas y miedo', right: 'Amígdala' },
            { left: 'Planifica y regula la atención', right: 'Corteza prefrontal' },
            { left: 'Percibe las señales del cuerpo', right: 'Ínsula' }
          ],
          feedbackCorrect: '✅ Excelente.',
          feedbackIncorrect: 'Casi. Revisa: Amígdala → miedo, CPF → planificación, Ínsula → sensaciones.',
          xp: 30,
          evidence: 'sólida'
        }
      }
    ]
  },
  {
    id: 'module3',
    title: 'Por qué cambia tu cerebro',
    icon: '🔥',
    description: 'Neuroplasticidad: el cerebro cambia con la experiencia.',
    requiredXP: 100,
    unlocked: false,
    lessons: [
      {
        id: 'm3l1',
        title: 'Las conexiones se fortalecen con el uso',
        slides: [{ type: 'text', content: 'Las conexiones neuronales se fortalecen con la repetición. Es como un camino: cuanto más lo usas, más marcado queda.' }],
        challenge: {
          type: 'true-false',
          question: 'Las conexiones neuronales se fortalecen con la repetición.',
          correct: true,
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ Sí, se fortalecen.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm3l2',
        title: 'La poda sináptica: menos es más',
        slides: [{ type: 'text', content: 'El cerebro elimina conexiones que no usa. Eso se llama poda sináptica.' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué hace el cerebro con las conexiones que no usa?',
          options: ['Las convierte en recuerdos', 'Las debilita y elimina (poda sináptica)', 'Las transforma en nuevas neuronas'],
          correct: 1,
          feedbackCorrect: '✅ Exacto.',
          feedbackIncorrect: '❌ La respuesta correcta es B.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm3l3',
        title: 'Plasticidad en adultos: nunca es tarde',
        slides: [{ type: 'text', content: 'La neuroplasticidad ocurre a cualquier edad. Personas de 60 o 70 años pueden tener cambios cerebrales con la meditación.' }],
        challenge: {
          type: 'true-false',
          question: 'La neuroplasticidad solo ocurre en personas jóvenes.',
          correct: false,
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ Ocurre toda la vida.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm3l4',
        title: 'Desafío final: aplicar plasticidad',
        slides: [{ type: 'text', content: 'Situación: meditas 10 minutos al día durante 6 meses. ¿Qué cambios cerebrales podrías esperar?' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué cambios cerebrales podrías esperar?',
          options: ['Ninguno', 'Aumento de densidad de materia gris en áreas de atención y regulación emocional', 'Tu cerebro se encoge'],
          correct: 1,
          feedbackCorrect: '✅ Exacto.',
          feedbackIncorrect: '❌ La respuesta correcta es B.',
          xp: 30,
          evidence: 'sólida'
        }
      }
    ]
  },
  {
    id: 'module4',
    title: 'La mente que divaga',
    icon: '🌊',
    description: 'La red neuronal por defecto (DMN) y cómo la meditación la calma.',
    requiredXP: 150,
    unlocked: false,
    lessons: [
      {
        id: 'm4l1',
        title: 'La DMN: el cerebro en piloto automático',
        slides: [{ type: 'text', content: 'Cuando tu mente divaga, se activa la Default Mode Network (DMN). Es el piloto automático del cerebro.' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué hace la Default Mode Network (DMN)?',
          options: ['Coordina movimientos', 'Se activa cuando la mente divaga', 'Regula el sueño'],
          correct: 1,
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ La respuesta correcta es B.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm4l2',
        title: 'Rumiación y ansiedad en la DMN',
        slides: [{ type: 'text', content: 'La DMN está sobreactivada en ansiedad y depresión. La meditación reduce su actividad.' }],
        challenge: {
          type: 'true-false',
          question: 'La meditación reduce la actividad de la DMN.',
          correct: true,
          feedbackCorrect: '✅ Sí.',
          feedbackIncorrect: '❌ Sí, la reduce.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm4l3',
        title: 'Meditar reduce la DMN',
        slides: [{ type: 'text', content: 'La atención plena entrena al cerebro para salir de la DMN y volver al presente.' }],
        challenge: {
          type: 'fill-blank',
          question: 'La práctica de atención plena entrena al cerebro para salir de la ___ y volver al momento presente.',
          correct: 'DMN',
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ La respuesta es DMN.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm4l4',
        title: 'Desafío final: DMN vs atención plena',
        slides: [{ type: 'text', content: 'Situación: comes y tu mente se va a un problema del trabajo. Luego vuelves a notar el sabor.' }],
        challenge: {
          type: 'match',
          question: 'Empareja cada estado con la red cerebral correspondiente:',
          pairs: [
            { left: 'Mente divaga en problemas', right: 'DMN' },
            { left: 'Notas el sabor de la comida', right: 'Atención plena' }
          ],
          feedbackCorrect: '✅ Excelente.',
          feedbackIncorrect: 'Casi. DMN → mente divaga, Atención plena → presente.',
          xp: 30,
          evidence: 'sólida'
        }
      }
    ]
  },
  {
    id: 'module5',
    title: 'Meditación por tipo',
    icon: '🏆',
    description: 'Qué zonas del cerebro se activan con cada tipo de meditación.',
    requiredXP: 200,
    unlocked: false,
    lessons: [
      {
        id: 'm5l1',
        title: 'Atención plena – prefrontal y atención',
        slides: [{ type: 'text', content: 'La atención plena entrena la corteza prefrontal (atención) y la ínsula (conciencia corporal).' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué zona se fortalece más con la atención plena?',
          options: ['Amígdala', 'Corteza prefrontal', 'Hipotálamo'],
          correct: 1,
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ La respuesta es corteza prefrontal.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l2',
        title: 'Compasión (metta) – circuitos de empatía',
        slides: [{ type: 'text', content: 'La meditación de compasión activa circuitos de empatía y cuidado.' }],
        challenge: {
          type: 'true-false',
          question: 'La meditación de compasión activa circuitos de empatía.',
          correct: true,
          feedbackCorrect: '✅ Sí.',
          feedbackIncorrect: '❌ Sí, los activa.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l3',
        title: 'Body scan – ínsula y sensaciones corporales',
        slides: [{ type: 'text', content: 'El body scan activa la ínsula, mejorando la conciencia corporal.' }],
        challenge: {
          type: 'fill-blank',
          question: 'El body scan activa principalmente la ___ , la zona que procesa las sensaciones corporales.',
          correct: 'ínsula',
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ La respuesta es ínsula.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l4',
        title: 'Meditación caminando – integración motora',
        slides: [{ type: 'text', content: 'Meditar caminando integra atención plena con movimiento.' }],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué tipo de meditación integra el movimiento con la atención plena?',
          options: ['Body scan', 'Meditación caminando', 'Metta'],
          correct: 1,
          feedbackCorrect: '✅ Correcto.',
          feedbackIncorrect: '❌ La respuesta es meditación caminando.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l5',
        title: 'Desafío final: elige tu práctica',
        slides: [{ type: 'text', content: 'Ahora sabes qué zonas se activan con cada tipo. Elige según tu objetivo.' }],
        challenge: {
          type: 'match',
          question: 'Empareja cada objetivo con la práctica más adecuada:',
          pairs: [
            { left: 'Reducir ansiedad', right: 'Atención plena' },
            { left: 'Desarrollar empatía', right: 'Compasión (metta)' },
            { left: 'Mejorar conciencia corporal', right: 'Body scan' },
            { left: 'Integrar movimiento', right: 'Meditación caminando' }
          ],
          feedbackCorrect: '✅ Excelente.',
          feedbackIncorrect: 'Casi. Revisa la relación.',
          xp: 30,
          evidence: 'sólida'
        }
      }
    ]
  }
];

export default function SeedButton() {
  const handleSeed = async () => {
    try {
      for (const module of modules) {
        await setDoc(doc(db, 'neuroModules', module.id), module);
        console.log(`✅ Subido: ${module.title}`);
      }
      alert('🎉 Módulos subidos correctamente.');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error al subir módulos. Revisa la consola.');
    }
  };

  return (
    <button
      onClick={handleSeed}
      style={{
        padding: '12px 24px',
        background: '#6C63FF',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        marginBottom: '20px'
      }}
    >
      🔥 Subir módulos de Neurociencia
    </button>
  );
}