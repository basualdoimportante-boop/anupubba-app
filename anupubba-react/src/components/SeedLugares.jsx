// src/components/SeedLugares.jsx
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const lugares = [
  {
    id: 'lugar1',
    nombre: 'Centro de Yoga Zen',
    lat: -33.4500,
    lng: -70.6600,
    direccion: 'Providencia 123, Santiago',
    telefono: '+56 9 1234 5678',
    categoria: 'yoga',
    icono: '🧘',
    descripcion: 'Clases de yoga para todos los niveles, meditación y bienestar integral.',
    aprobado: true,
    valoracion: 4.8,
    totalResenas: 12
  },
  {
    id: 'lugar2',
    nombre: 'Red Psicológica Ánima',
    lat: -33.4480,
    lng: -70.6680,
    direccion: 'Calle Nueva 456, Ñuñoa',
    telefono: '+56 9 8765 4321',
    categoria: 'psicologia',
    icono: '🧠',
    descripcion: 'Psicólogos especializados en ansiedad, depresión y bienestar emocional.',
    aprobado: true,
    valoracion: 4.9,
    totalResenas: 8
  },
  {
    id: 'lugar3',
    nombre: 'Gimnasio Fuerza Vital',
    lat: -33.4550,
    lng: -70.6550,
    direccion: 'Av. Irarrázaval 789, Ñuñoa',
    telefono: '+56 9 1122 3344',
    categoria: 'deporte',
    icono: '🏋️',
    descripcion: 'Entrenamiento funcional, levantamiento olímpico y preparación física.',
    aprobado: true,
    valoracion: 4.5,
    totalResenas: 6
  },
  {
    id: 'lugar4',
    nombre: 'Espacio Hanabi Yoga',
    lat: -33.4420,
    lng: -70.6720,
    direccion: 'Los Leones 1010, Providencia',
    telefono: '+56 9 5566 7788',
    categoria: 'yoga',
    icono: '🧘',
    descripcion: 'Yoga caliente, meditación guiada y talleres de respiración.',
    aprobado: true,
    valoracion: 4.7,
    totalResenas: 10
  },
  {
    id: 'lugar5',
    nombre: 'Centro Psicológico Reverie',
    lat: -33.4520,
    lng: -70.6630,
    direccion: 'Av. Italia 456, Ñuñoa',
    telefono: '+56 9 9900 1122',
    categoria: 'psicologia',
    icono: '🧠',
    descripcion: 'Terapia individual, de pareja y familiar. Enfoque en salud mental.',
    aprobado: true,
    valoracion: 4.6,
    totalResenas: 7
  },
  {
    id: 'lugar6',
    nombre: 'Box BJJ & Fitness',
    lat: -33.4530,
    lng: -70.6500,
    direccion: 'Av. Ossa 789, Ñuñoa',
    telefono: '+56 9 3344 5566',
    categoria: 'deporte',
    icono: '🥋',
    descripcion: 'Jiu-Jitsu brasileño, Muay Thai y entrenamiento funcional.',
    aprobado: true,
    valoracion: 4.4,
    totalResenas: 5
  },
  {
    id: 'lugar7',
    nombre: 'Vegetarian Kitchen',
    lat: -33.4470,
    lng: -70.6640,
    direccion: 'Av. Manuel Montt 345, Providencia',
    telefono: '+56 9 7788 9900',
    categoria: 'alimentacion',
    icono: '🥗',
    descripcion: 'Comida vegetariana y vegana, saludable y sostenible.',
    aprobado: true,
    valoracion: 4.3,
    totalResenas: 9
  }
];

export default function SeedLugares() {
  const handleSeed = async () => {
    try {
      for (const lugar of lugares) {
        await setDoc(doc(db, 'lugares', lugar.id), lugar);
        console.log(`✅ Subido: ${lugar.nombre}`);
      }
      alert('🎉 Lugares subidos correctamente.');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('❌ Error al subir lugares.');
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
      🗺️ Subir lugares de ejemplo
    </button>
  );
}