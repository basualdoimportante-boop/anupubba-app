import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_34y5abm';
const TEMPLATE_ID = 'template_fjt153a';
const PUBLIC_KEY = '7yMpqOJAXIO6-oaTz';

export const enviarRecordatorio = (nombreUsuario, emailUsuario, testsListHTML) => {
  // Si nombreUsuario no es válido, usar el email antes del @
  const nombre = (nombreUsuario && nombreUsuario.trim() !== '' && nombreUsuario !== 'null') 
    ? nombreUsuario 
    : emailUsuario.split('@')[0];

  const cuerpoHTML = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9ff; border-radius: 16px;">
      <h1 style="color: #6C63FF; text-align: center;">🌅 Anupubba</h1>
      <p style="font-size: 18px; text-align: center; color: #333;">
        Hola ${nombre},
      </p>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        Queremos recordarte que puedes realizar los siguientes tests de bienestar:
      </p>
      ${testsListHTML}
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://anupubba-bienestar.web.app/tests" 
           style="background-color: #6C63FF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
          Ir a mis tests
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
      <p style="font-size: 14px; color: #888; text-align: center;">
        Este recordatorio fue solicitado desde Anupubba.<br />
        Si no deseas recibir más correos, ignora este mensaje.
      </p>
    </div>
  `;

  const params = {
    to_email: emailUsuario,
    message_html: cuerpoHTML,
  };

  console.log('📧 Enviando a EmailJS con:', params);

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
};