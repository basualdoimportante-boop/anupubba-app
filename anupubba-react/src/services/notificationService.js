import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// 🔥 Reemplaza con los valores de tu archivo JSON descargado
// (Esto es para usar desde una Cloud Function, no desde el frontend)
// Por ahora lo dejamos para pruebas locales.
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwp4bsjnrGXQF3...\n-----END PRIVATE KEY-----';
const CLIENT_EMAIL = 'firebase-adminsdk-xxxxx@anupubba-bienestar.iam.gserviceaccount.com';
const PROJECT_ID = 'anupubba-bienestar';

// Función para generar token OAuth2
const getAccessToken = async () => {
  try {
    const jwt = require('jsonwebtoken');
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };
    const token = jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener token OAuth2: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.access_token) {
      throw new Error('No se recibió access_token');
    }
    return data.access_token;
  } catch (err) {
    console.error('Error en getAccessToken:', err);
    throw err;
  }
};

// Función para enviar notificación a un usuario usando API V1
export const enviarNotificacionAUsuario = async (userId, titulo, cuerpo, url = '/') => {
  try {
    // Obtener token del dispositivo del usuario
    const docRef = doc(db, 'tokensNotificacion', userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.warn('❌ Usuario no tiene token registrado');
      return { success: false, error: 'No token' };
    }
    const token = docSnap.data().token;
    
    // Obtener token OAuth2
    const accessToken = await getAccessToken();
    
    // Enviar notificación con API V1
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        message: {
          token: token,
          notification: {
            title: titulo,
            body: cuerpo,
            image: 'https://anupubba-bienestar.web.app/logo192.png'
          },
          webpush: {
            fcm_options: {
              link: `https://anupubba-bienestar.web.app${url}`
            }
          }
        }
      })
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error al enviar notificación');
    }
    console.log('✅ Notificación enviada:', result);
    return { success: true, result };
  } catch (err) {
    console.error('❌ Error al enviar notificación:', err);
    return { success: false, error: err.message };
  }
};