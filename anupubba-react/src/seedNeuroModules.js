// src/seedNeuroModules.js
import { db } from './firebaseConfig';
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
        slides: [
          { type: 'text', content: 'El cerebro no trabaja como un músculo que se fortalece todo junto. Es más como una orquesta: cada sección tiene su papel. La meditación entrena a ciertos músicos, no a todos.' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Cuál es la mejor analogía para el cerebro?',
          options: ['Un solo músculo que se puede fortalecer', 'Una orquesta con varias secciones que trabajan juntas', 'Un computador con software fijo'],
          correct: 1,
          feedbackCorrect: '✅ Correcto. La orquesta es mejor analogía: cada zona tiene su función, y meditar afina algunas secciones específicas.',
          feedbackIncorrect: 'Casi. La mejor analogía es la de una orquesta, porque el cerebro tiene diferentes zonas con roles distintos.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l2',
        title: 'Las neuronas y las conexiones',
        slides: [
          { type: 'text', content: 'Las neuronas son las células que procesan información. Se comunican a través de conexiones llamadas sinapsis. Piensa en las neuronas como los músicos y las sinapsis como la partitura.' }
        ],
        challenge: {
          type: 'match',
          question: 'Empareja cada término con su analogía:',
          pairs: [
            { left: 'Neurona', right: 'Músico' },
            { left: 'Sinapsis', right: 'Partitura' }
          ],
          feedbackCorrect: '✅ Así es. Las sinapsis son las conexiones que se modifican con la experiencia. Meditar refuerza las conexiones que llevan a la calma.',
          feedbackIncorrect: 'Casi. Revisa: Neurona es el músico, Sinapsis es la partitura.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l3',
        title: 'Neuroplasticidad intro',
        slides: [
          { type: 'text', content: 'La neuroplasticidad es la capacidad del cerebro para reorganizarse: crear nuevas conexiones y eliminar las que no usa. Esto pasa toda la vida, no solo en la infancia.' }
        ],
        challenge: {
          type: 'true-false',
          question: 'La neuroplasticidad solo ocurre en niños.',
          correct: false,
          feedbackCorrect: '✅ Correcto. La neuroplasticidad ocurre toda la vida, y la meditación es una de las formas de activarla.',
          feedbackIncorrect: '❌ La neuroplasticidad ocurre toda la vida, no solo en la infancia.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l4',
        title: '¿Por qué meditar cambia el cerebro?',
        slides: [
          { type: 'text', content: 'La meditación entrena la atención y la regulación emocional. Cada vez que vuelves la atención a la respiración, estás ejercitando la corteza prefrontal y calmando la amígdala.' }
        ],
        challenge: {
          type: 'fill-blank',
          question: 'Cada vez que notás que tu mente divaga y la traés de vuelta, estás ejercitando la ___ prefrontal.',
          correct: 'corteza',
          feedbackCorrect: '✅ Correcto. Es como un entrenamiento de atención. Con la práctica, la corteza prefrontal se vuelve más fuerte.',
          feedbackIncorrect: '❌ La respuesta es corteza. La corteza prefrontal es la zona que regula la atención.',
          xp: 10,
          evidence: 'sólida'
        }
      },
      {
        id: 'm1l5',
        title: 'Mini-desafío final del módulo',
        slides: [
          { type: 'text', content: 'Situación: llevas 10 días meditando 5 minutos cada día. Sientes que te cuesta menos volver a la respiración cuando te distraes. ¿Qué está pasando en tu cerebro?' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué está pasando en tu cerebro?',
          options: ['Estás creando nuevas neuronas en la amígdala.', 'Estás fortaleciendo la corteza prefrontal y calmando la amígdala.', 'Tu cerebro no ha cambiado, solo te estás relajando.'],
          correct: 1,
          feedbackCorrect: '✅ Exacto. Las conexiones de la corteza prefrontal se están fortaleciendo con la práctica repetida. La amígdala se está volviendo menos reactiva.',
          feedbackIncorrect: '❌ La respuesta correcta es B: estás fortaleciendo la corteza prefrontal y calmando la amígdala.',
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
        slides: [
          { type: 'text', content: 'Tenés una alarma de humo dentro del cerebro. Se llama amígdala. Su trabajo es detectar amenazas y disparar ansiedad antes de que puedas pensar.' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué pasa con la amígdala cuando meditás seguido?',
          options: ['Se agranda', 'Se vuelve menos reactiva', 'Desaparece'],
          correct: 1,
          feedbackCorrect: '✅ Exacto. Estudios de imagen cerebral muestran menor actividad de la amígdala ante el estrés en meditadores regulares.',
          feedbackIncorrect: 'Casi. La amígdala no desaparece ni se agranda: se vuelve menos reactiva.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm2l2',
        title: 'Corteza prefrontal: el director de orquesta',
        slides: [
          { type: 'text', content: 'La corteza prefrontal (CPF) es la zona que planifica, regula impulsos y sostiene la atención. Es como el director de la orquesta: coordina a los demás músicos.' }
        ],
        challenge: {
          type: 'true-false',
          question: 'La corteza prefrontal se fortalece con la práctica de meditación.',
          correct: true,
          feedbackCorrect: '✅ Sí. La CPF es una de las zonas que más se activa y fortalece con la meditación, mejorando el foco y el autocontrol.',
          feedbackIncorrect: '❌ Sí, se fortalece. La meditación es como un entrenamiento para la CPF.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm2l3',
        title: 'Ínsula: el radar corporal',
        slides: [
          { type: 'text', content: 'La ínsula es la zona que percibe las señales del cuerpo: respiración, latidos, tensión muscular. Es tu radar corporal.' }
        ],
        challenge: {
          type: 'fill-blank',
          question: 'La ___ es la zona del cerebro que percibe las señales del cuerpo, como la respiración y los latidos.',
          correct: 'ínsula',
          feedbackCorrect: '✅ Correcto. La ínsula es el radar corporal. Se activa mucho durante el body scan y la meditación de atención plena.',
          feedbackIncorrect: '❌ La respuesta es ínsula. Es la zona que procesa las sensaciones corporales.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm2l4',
        title: 'Desafío final: identifica las zonas',
        slides: [
          { type: 'text', content: 'Identifica qué zona del cerebro se asocia con cada función.' }
        ],
        challenge: {
          type: 'match',
          question: 'Empareja cada función con la zona correspondiente:',
          pairs: [
            { left: 'Detecta amenazas y miedo', right: 'Amígdala' },
            { left: 'Planifica y regula la atención', right: 'Corteza prefrontal' },
            { left: 'Percibe las señales del cuerpo', right: 'Ínsula' }
          ],
          feedbackCorrect: '✅ Excelente. Ya conoces las 3 zonas clave y cómo se relacionan con la meditación.',
          feedbackIncorrect: 'Casi. Revisa: Amígdala → miedo, CPF → planificación/atención, Ínsula → sensaciones corporales.',
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
    description: 'Neuroplasticidad: el cerebro cambia con la experiencia. Cómo la meditación aprovecha esto.',
    requiredXP: 100,
    unlocked: false,
    lessons: [
      {
        id: 'm3l1',
        title: 'Las conexiones se fortalecen con el uso',
        slides: [
          { type: 'text', content: 'Las conexiones neuronales se fortalecen con la repetición. Es como un camino: cuanto más lo usas, más marcado queda. Meditar es como caminar repetidamente por el sendero de la calma y la atención.' }
        ],
        challenge: {
          type: 'true-false',
          question: 'Las conexiones neuronales se fortalecen con la repetición.',
          correct: true,
          feedbackCorrect: '✅ Correcto. La repetición fortalece las sinapsis, y eso es la base de la neuroplasticidad.',
          feedbackIncorrect: '❌ Sí, se fortalecen con la repetición. Eso es la neuroplasticidad.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm3l2',
        title: 'La poda sináptica: menos es más',
        slides: [
          { type: 'text', content: 'El cerebro también elimina conexiones que no usa. Eso se llama poda sináptica. Cuando meditas, no solo creas nuevas conexiones de calma, también debilitas las conexiones de ansiedad y reactividad.' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué hace el cerebro con las conexiones que no usa?',
          options: ['Las convierte en recuerdos', 'Las debilita y elimina (poda sináptica)', 'Las transforma en nuevas neuronas'],
          correct: 1,
          feedbackCorrect: '✅ Exacto. La poda sináptica elimina conexiones que no se usan, dejando espacio para fortalecer las que sí se practican.',
          feedbackIncorrect: '❌ La respuesta correcta es B: las debilita y elimina (poda sináptica).',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm3l3',
        title: 'Plasticidad en adultos: nunca es tarde',
        slides: [
          { type: 'text', content: 'Durante mucho tiempo se creyó que el cerebro adulto era fijo. Hoy sabemos que la neuroplasticidad ocurre a cualquier edad. Personas de 60 o 70 años pueden tener cambios cerebrales significativos con la meditación.' }
        ],
        challenge: {
          type: 'true-false',
          question: 'La neuroplasticidad solo ocurre en personas jóvenes.',
          correct: false,
          feedbackCorrect: '✅ Correcto. La neuroplasticidad ocurre a cualquier edad. La meditación puede cambiar el cerebro incluso en adultos mayores.',
          feedbackIncorrect: '❌ La neuroplasticidad ocurre durante toda la vida, no solo en la juventud.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm3l4',
        title: 'Desafío final: aplicar plasticidad',
        slides: [
          { type: 'text', content: 'Situación: decides meditar 10 minutos al día durante 6 meses. ¿Qué cambios cerebrales podrías esperar?' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué cambios cerebrales podrías esperar?',
          options: ['Ninguno, el cerebro adulto no cambia.', 'Aumento de la densidad de materia gris en áreas relacionadas con la atención y la regulación emocional.', 'Tu cerebro se encoge para procesar más rápido.'],
          correct: 1,
          feedbackCorrect: '✅ Exacto. Estudios muestran que la práctica regular aumenta la densidad de materia gris en la corteza prefrontal, la ínsula y otras zonas.',
          feedbackIncorrect: '❌ La respuesta correcta es B: aumento de la densidad de materia gris en áreas de atención y regulación emocional.',
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
    description: 'La red neuronal por defecto (DMN): por qué la mente divaga y cómo la meditación la calma.',
    requiredXP: 150,
    unlocked: false,
    lessons: [
      {
        id: 'm4l1',
        title: 'La DMN: el cerebro en piloto automático',
        slides: [
          { type: 'text', content: 'Cuando tu mente divaga, no es que se apague: se activa una red llamada Default Mode Network (DMN). Es el piloto automático del cerebro: planifica el futuro, recuerda el pasado, pero también genera rumiación y ansiedad.' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué hace la Default Mode Network (DMN)?',
          options: ['Coordina los movimientos del cuerpo', 'Se activa cuando la mente divaga, planifica o recuerda', 'Regula el sueño y la vigilia'],
          correct: 1,
          feedbackCorrect: '✅ Correcto. La DMN es el piloto automático del cerebro, y su activación constante se asocia con ansiedad y rumiación.',
          feedbackIncorrect: '❌ La respuesta correcta es B: se activa cuando la mente divaga y planifica.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm4l2',
        title: 'Rumiación y ansiedad en la DMN',
        slides: [
          { type: 'text', content: 'La DMN está sobreactivada en personas con ansiedad y depresión. Rumiar es quedarse atrapado en la DMN. La meditación reduce la actividad de la DMN, lo que disminuye la tendencia a darle vueltas a los problemas.' }
        ],
        challenge: {
          type: 'true-false',
          question: 'La meditación reduce la actividad de la DMN.',
          correct: true,
          feedbackCorrect: '✅ Sí. Estudios fMRI muestran que la meditación reduce la activación de la DMN, lo que se asocia con menos rumiación.',
          feedbackIncorrect: '❌ Sí, la meditación reduce la actividad de la DMN.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm4l3',
        title: 'Meditar reduce la DMN',
        slides: [
          { type: 'text', content: 'La práctica de atención plena entrena al cerebro para salir de la DMN y volver al momento presente. Con la repetición, la DMN se calma, y la mente divaga menos.' }
        ],
        challenge: {
          type: 'fill-blank',
          question: 'La práctica de atención plena entrena al cerebro para salir de la ___ y volver al momento presente.',
          correct: 'DMN',
          feedbackCorrect: '✅ Correcto. La DMN es el piloto automático; la atención plena es el freno.',
          feedbackIncorrect: '❌ La respuesta es DMN (Default Mode Network).',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm4l4',
        title: 'Desafío final: DMN vs atención plena',
        slides: [
          { type: 'text', content: 'Situación: estás comiendo y tu mente se va a un problema del trabajo. Luego vuelves a notar el sabor de la comida.' }
        ],
        challenge: {
          type: 'match',
          question: 'Empareja cada estado con la red cerebral correspondiente:',
          pairs: [
            { left: 'Mente divaga en problemas del trabajo', right: 'DMN' },
            { left: 'Notas el sabor de la comida', right: 'Atención plena (prefrontal y sensorial)' }
          ],
          feedbackCorrect: '✅ Excelente. Así es como funciona: la atención plena te saca de la DMN y te trae al presente.',
          feedbackIncorrect: 'Casi. Revisa: DMN → mente divaga, Atención plena → presente.',
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
    description: 'Qué zonas del cerebro se activan con cada tipo de meditación: atención plena, compasión, body scan, caminando.',
    requiredXP: 200,
    unlocked: false,
    lessons: [
      {
        id: 'm5l1',
        title: 'Atención plena (mindfulness) – prefrontal y atención',
        slides: [
          { type: 'text', content: 'La meditación de atención plena entrena principalmente la corteza prefrontal (atención) y la ínsula (conciencia corporal). También reduce la reactividad de la amígdala.' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué zona del cerebro se fortalece más con la atención plena?',
          options: ['Amígdala', 'Corteza prefrontal', 'Hipotálamo'],
          correct: 1,
          feedbackCorrect: '✅ Correcto. La corteza prefrontal es clave para la atención y se fortalece con la práctica de mindfulness.',
          feedbackIncorrect: '❌ La respuesta correcta es la corteza prefrontal.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l2',
        title: 'Compasión (metta) – circuitos de empatía',
        slides: [
          { type: 'text', content: 'La meditación de compasión (metta) activa circuitos relacionados con la empatía y el cuidado, incluyendo la ínsula y regiones asociadas a la recompensa social.' }
        ],
        challenge: {
          type: 'true-false',
          question: 'La meditación de compasión activa circuitos de empatía.',
          correct: true,
          feedbackCorrect: '✅ Sí. La práctica de metta se asocia con mayor activación en redes de empatía y cuidado.',
          feedbackIncorrect: '❌ Sí, activa circuitos de empatía.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l3',
        title: 'Body scan – ínsula y sensaciones corporales',
        slides: [
          { type: 'text', content: 'El body scan es como un radar que recorre el cuerpo. Activa la ínsula, la zona que procesa las sensaciones físicas, mejorando la conciencia corporal y la regulación emocional.' }
        ],
        challenge: {
          type: 'fill-blank',
          question: 'El body scan activa principalmente la ___ , la zona que procesa las sensaciones corporales.',
          correct: 'ínsula',
          feedbackCorrect: '✅ Correcto. La ínsula es el radar corporal, y el body scan la entrena.',
          feedbackIncorrect: '❌ La respuesta es ínsula.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l4',
        title: 'Meditación caminando – integración motora',
        slides: [
          { type: 'text', content: 'Meditar caminando integra la atención plena con el movimiento. Activa no solo la corteza prefrontal, sino también áreas motoras y sensoriales, creando una conexión mente-cuerpo más profunda.' }
        ],
        challenge: {
          type: 'multiple-choice',
          question: '¿Qué tipo de meditación integra el movimiento con la atención plena?',
          options: ['Body scan', 'Meditación caminando', 'Metta'],
          correct: 1,
          feedbackCorrect: '✅ Correcto. La meditación caminando es única porque integra la atención plena con el movimiento.',
          feedbackIncorrect: '❌ La respuesta correcta es la meditación caminando.',
          xp: 15,
          evidence: 'sólida'
        }
      },
      {
        id: 'm5l5',
        title: 'Desafío final: elige tu práctica',
        slides: [
          { type: 'text', content: 'Ahora que sabes qué zonas se activan con cada tipo de meditación, ¿cuál elegirías según tu objetivo?' }
        ],
        challenge: {
          type: 'match',
          question: 'Empareja cada objetivo con la práctica más adecuada:',
          pairs: [
            { left: 'Reducir ansiedad y rumiación', right: 'Atención plena (mindfulness)' },
            { left: 'Desarrollar empatía y conexión', right: 'Compasión (metta)' },
            { left: 'Mejorar conciencia corporal', right: 'Body scan' },
            { left: 'Integrar cuerpo y mente en movimiento', right: 'Meditación caminando' }
          ],
          feedbackCorrect: '✅ Excelente. Ahora puedes elegir tu práctica según tu intención. Todas son válidas y se complementan.',
          feedbackIncorrect: 'Casi. Revisa la relación: ansiedad → mindfulness, empatía → metta, cuerpo → body scan, movimiento → caminando.',
          xp: 30,
          evidence: 'sólida'
        }
      }
    ]
  }
];

// 🔥 FUNCIÓN PARA SUBIR MÓDULOS A FIRESTORE
export async function seedNeuroModules() {
  try {
    for (const module of modules) {
      await setDoc(doc(db, 'neuroModules', module.id), module);
      console.log(`✅ Subido: ${module.title}`);
    }
    console.log('🎉 Todos los módulos subidos correctamente.');
  } catch (error) {
    console.error('❌ Error al subir módulos:', error);
  }
}