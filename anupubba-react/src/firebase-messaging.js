import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebaseConfig';

// Inicializar messaging
export const messaging = getMessaging(app);

// Solicitar permiso y obtener token
export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permiso de notificaciones denegado');
      return null;
    }

    // 🔥 Reemplaza TU_VAPID_KEY con la clave VAPID de Firebase Console
    const token = await getToken(messaging, {
      vapidKey: BMff-t2SWhOiD3_wamo5RuxeLDZjcVkFLazypPspweMihNh37G6O9uoyRFhil6rFhqnjFyAIO1sKw6CM1ZPO2pE
    });
    console.log('Token FCM:', token);
    return token;
  } catch (err) {
    console.error('Error al obtener token:', err);
    return null;
  }
};

// Escuchar mensajes en primer plano
export const listenForMessages = (callback) => {
  onMessage(messaging, (payload) => {
    console.log('📱 Notificación en primer plano:', payload);
    if (callback) callback(payload);
  });
};