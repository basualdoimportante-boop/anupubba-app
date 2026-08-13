// src/components/SubirMeditaciones.jsx
import { useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const CLOUDINARY_CLOUD_NAME = 'anpgjzjf';
const CLOUDINARY_UPLOAD_PRESET = 'anupubba_audios';

const meditacionesData = [
  { order: 1, title: 'Bondad Amorosa' },
  { order: 2, title: 'Escaneo Corporal' },
  { order: 3, title: 'Lake' },
  { order: 4, title: 'Mountain' },
  { order: 5, title: 'Práctica Sentada' },
  { order: 6, title: 'Práctica Silenciosa' },
  { order: 7, title: 'Suavizar-Calmar' },
  { order: 8, title: 'Turning Toward (Emocional)' },
  { order: 9, title: 'Turning Toward (Físico)' }
];

function SubirMeditaciones() {
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const subirAudio = async (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'meditaciones');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        addLog(`✅ ${title}: Subido correctamente`);
        return data.secure_url;
      } else {
        addLog(`❌ ${title}: ${data.error?.message || 'Error desconocido'}`);
        return null;
      }
    } catch (error) {
      addLog(`❌ ${title}: ${error.message}`);
      return null;
    }
  };

  const handleSubir = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    setLogs([]);
    setTotalFiles(files.length);
    setUploadedCount(0);

    const sortedFiles = Array.from(files).sort((a, b) => {
      const numA = parseInt(a.name.replace('.mp3', ''));
      const numB = parseInt(b.name.replace('.mp3', ''));
      return numA - numB;
    });

    for (let i = 0; i < sortedFiles.length; i++) {
      const file = sortedFiles[i];
      const med = meditacionesData[i];
      if (!med) {
        addLog(`⚠️ Archivo ${file.name} no tiene título asignado`);
        continue;
      }

      const url = await subirAudio(file, med.title);
      if (url) {
        await setDoc(doc(db, 'meditaciones', `med_${med.order}`), {
          order: med.order,
          title: med.title,
          fileUrl: url,
          createdAt: new Date()
        });
        addLog(`📝 Guardado en Firestore: ${med.title}`);
        setUploadedCount(prev => prev + 1);
      }
    }

    setUploading(false);
    addLog(`🎉 Proceso completado. ${uploadedCount} de ${totalFiles} archivos subidos.`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📤 Subir Meditaciones</h2>
      <p style={{ color: '#666' }}>
        Selecciona los 9 archivos MP3 numerados del 1 al 9 (ej. 1.mp3, 2.mp3, ...).
      </p>
      <input
        type="file"
        accept=".mp3"
        multiple
        onChange={handleSubir}
        disabled={uploading}
        style={{ marginBottom: '15px', display: 'block' }}
      />
      {uploading && <p style={{ color: '#6C63FF' }}>Subiendo... {uploadedCount}/{totalFiles}</p>}
      <div style={{
        background: '#f9f9f9',
        padding: '12px',
        borderRadius: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
        fontSize: '0.9rem',
        fontFamily: 'monospace'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '4px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubirMeditaciones;