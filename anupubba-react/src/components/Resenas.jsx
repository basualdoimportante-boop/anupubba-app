// src/components/Resenas.jsx
import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // ✅ Ruta correcta (sube un nivel)
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, increment, orderBy } from 'firebase/firestore';

function Resenas({ lugarId }) {
  // ... (resto del código igual)
}

export default Resenas;