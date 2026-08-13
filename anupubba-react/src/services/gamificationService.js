import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Inicializar desafíos para un nuevo usuario
export const inicializarDesafios = async (userId) => {
  const misionesBase = [
    { id: 'primer_test', nombre: '🌟 Primer test', descripcion: 'Completa tu primer test de bienestar', completada: false, recompensa: 'Insignia Explorador' },
    { id: 'tres_tests', nombre: '🏆 Tres tests', descripcion: 'Completa 3 tests diferentes', completada: false, recompensa: 'Insignia Aprendiz' },
    { id: 'primer_modulo', nombre: '📚 Primer módulo', descripcion: 'Completa un módulo de Neurociencias, Deportes o Caminos', completada: false, recompensa: 'Insignia Estudiante' },
    { id: 'meditacion_3_dias', nombre: '🧘 3 días de meditación', descripcion: 'Medita 3 días seguidos', completada: false, recompensa: 'Insignia Constancia' },
    { id: 'tres_modulos', nombre: '🎓 Tres módulos', descripcion: 'Completa 3 módulos de aprendizaje', completada: false, recompensa: 'Insignia Sabio' },
  ];
  await setDoc(doc(db, 'desafios', userId), { misiones: misionesBase });
};

// Obtener desafíos del usuario
export const getDesafios = async (userId) => {
  const docSnap = await getDoc(doc(db, 'desafios', userId));
  if (docSnap.exists()) return docSnap.data().misiones || [];
  return [];
};

// Marcar una misión como completada
export const completarMision = async (userId, misionId) => {
  const docRef = doc(db, 'desafios', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const misiones = docSnap.data().misiones;
  const index = misiones.findIndex(m => m.id === misionId);
  if (index === -1 || misiones[index].completada) return;
  misiones[index].completada = true;
  misiones[index].fechaCompletada = new Date().toISOString();
  await updateDoc(docRef, { misiones });
};

// Actualizar racha (meditación, tests, aprendizaje)
export const actualizarRacha = async (userId, tipo) => {
  const docRef = doc(db, 'rachas', userId);
  const docSnap = await getDoc(docRef);
  let data = docSnap.exists() ? docSnap.data() : {};
  if (!data[tipo]) data[tipo] = { diasConsecutivos: 0, ultimaFecha: null };

  const hoy = new Date().toISOString().split('T')[0];
  const ultima = data[tipo].ultimaFecha;
  if (ultima === hoy) return; // ya registrado hoy

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const ayerStr = ayer.toISOString().split('T')[0];
  if (ultima === ayerStr) {
    data[tipo].diasConsecutivos += 1;
  } else {
    data[tipo].diasConsecutivos = 1;
  }
  data[tipo].ultimaFecha = hoy;
  await setDoc(docRef, data, { merge: true });
};

// Obtener rachas
export const getRachas = async (userId) => {
  const docSnap = await getDoc(doc(db, 'rachas', userId));
  if (docSnap.exists()) return docSnap.data();
  return { meditacion: { diasConsecutivos: 0, ultimaFecha: null }, tests: { diasConsecutivos: 0, ultimaFecha: null }, aprendizaje: { diasConsecutivos: 0, ultimaFecha: null } };
};

// Contar cuántos tests únicos ha completado el usuario
export const contarTestsCompletados = async (userId) => {
  const docRef = doc(db, 'testResults', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return 0;
  const data = docSnap.data();
  // Asumiendo que guardas los testType en un array o en un campo
  // Si no, puedes contar los documentos en la colección testResults
  // Por simplicidad, devolvemos 0 si no hay datos
  return 0;
};

// Contar cuántos módulos ha completado el usuario
export const contarModulosCompletados = async (userId) => {
  // Similar a contarTestsCompletados
  return 0;
};