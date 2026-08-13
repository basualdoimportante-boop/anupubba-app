import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_cqlp78w';
const TEMPLATE_ID = 'template_wco37q9';
const PUBLIC_KEY = '7yMpqOJAXIO6-oaTz';

export const enviarRecordatorio = (nombreUsuario, emailUsuario, testsListHTML) => {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: emailUsuario,
      nombre: nombreUsuario || 'amigo/a',
      pruebas_disponibles: testsListHTML,
    },
    PUBLIC_KEY
  );
};