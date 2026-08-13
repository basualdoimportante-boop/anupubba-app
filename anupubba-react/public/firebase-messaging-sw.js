importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📱 Notificación en segundo plano:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body: body,
    icon: '/logo192.png',
    badge: '/badge-icon.png',
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Abrir app' }
    ]
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || 'https://anupubba-bienestar.web.app';
  event.waitUntil(
    clients.openWindow(url)
  );
});