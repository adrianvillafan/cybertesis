import nodemailer from 'nodemailer';
import { render } from '@react-email/render';  // Importamos render para convertir JSX a HTML
import TemplateMail from './templateMail.js';  // Importamos el componente JSX

// Crear el transportador de correo usando SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Usa `true` para el puerto 465, `false` para otros puertos
  auth: {
    user: process.env.USER, // Tu correo de Gmail
    pass: process.env.APP_PASSWORD, // La contraseña de aplicación generada
  },
});

// Función para enviar el correo
export const sendMail = async (to, subject, name, message, requestCode = 12) => {
  try {
    // Usa `await` para asegurarte de que la promesa se resuelve antes de pasarla a Nodemailer
    const emailHtml = await render(TemplateMail({ name, requestCode, message }));

    // Verificar que `emailHtml` sea un string
    console.log('Contenido de emailHtml:', typeof emailHtml);

    if (typeof emailHtml !== 'string') {
      throw new Error("El contenido de emailHtml no es un string");
    }

    // Opciones del correo
    const mailOptions = {
      from: {
        name: 'Vicerrectorado',
        address: process.env.USER,
      },
      to: to,
      subject: subject,
      html: emailHtml, // El HTML generado dinámicamente
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;  // Lanza el error nuevamente para que las rutas puedan manejarlo
  }
};

// Exportar la función para su uso en otras vistas
export default sendMail;
