import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Inicializar desafíos para un nuevo usuario
export const inicializarDesafios = async (userId) => {
  const misionesBase = [
    { id: 'meditacion_3_dias', nombre: '🧘 3 días de meditación', descripcion: 'Medita 3 días seguidos', completada: false, recompensa: 'Insignia Constancia' },
    { id: 'primer_modulo', nombre: '📚 Primer módulo', descripcion: 'Completa un módulo de Neurociencias, Deportes o Caminos', completada: false, recompensa: 'Insignia Estudiante' },
    { id: 'tres_modulos', nombre: '🎓 Tres módulos', descripcion: 'Completa 3 módulos de aprendizaje', completada: false, recompensa: 'Insignia Sabio' },
  ];
  await setDoc(doc(db, 'desafios', userId), {
    userId: userId,
    misiones: misionesBase
  });
};

// Obtener desafíos del usuario
export const getDesafios = async (userId) => {
  const docRef = doc(db, 'desafios', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().misiones || [];
  }
  await inicializarDesafios(userId);
  const nuevoDoc = await getDoc(docRef);
  return nuevoDoc.exists() ? nuevoDoc.data().misiones : [];
};

// Marcar una misión como completada
export const completarMision = async (userId, misionId) => {
  const docRef = doc(db, 'desafios', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    // Si no existe, inicializamos y luego completamos
    await inicializarDesafios(userId);
    // Volvemos a leer y completamos
    const nuevoDoc = await getDoc(docRef);
    if (!nuevoDoc.exists()) return;
    const misiones = nuevoDoc.data().misiones;
    const index = misiones.findIndex(m => m.id === misionId);
    if (index === -1) return;
    misiones[index].completada = true;
    misiones[index].fechaCompletada = new Date().toISOString();
    await updateDoc(docRef, { misiones });
    return;
  }
  const misiones = docSnap.data().misiones;
  const index = misiones.findIndex(m => m.id === misionId);
  if (index === -1 || misiones[index].completada) return;
  misiones[index].completada = true;
  misiones[index].fechaCompletada = new Date().toISOString();
  await updateDoc(docRef, { misiones });
};

// Actualizar racha (meditación, aprendizaje)
export const actualizarRacha = async (userId, tipo) => {
  const docRef = doc(db, 'rachas', userId);
  const docSnap = await getDoc(docRef);
  let data = docSnap.exists() ? docSnap.data() : {};
  // ✅ Asegurar que userId esté en el documento
  if (!data.userId) data.userId = userId;
  if (!data[tipo]) data[tipo] = { diasConsecutivos: 0, ultimaFecha: null };

  const hoy = new Date().toISOString().split('T')[0];
  const ultima = data[tipo].ultimaFecha;
  if (ultima === hoy) return;

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const ayerStr = ayer.toISOString().split('T')[0];
  if (ultima === ayerStr) {
    data[tipo].diasConsecutivos += 1;
  } else {
    data[tipo].diasConsecutivos = 1;
  }
  data[tipo].ultimaFecha = hoy;
  // ✅ Aseguramos que el documento contenga userId al crearse
  await setDoc(docRef, data, { merge: true });
};

// Obtener rachas
export const getRachas = async (userId) => {
  const docRef = doc(db, 'rachas', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data();
  return { meditacion: { diasConsecutivos: 0, ultimaFecha: null }, aprendizaje: { diasConsecutivos: 0, ultimaFecha: null } };
};