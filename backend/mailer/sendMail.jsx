import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import React from 'react';
import templateMail from './templateMail';

// Crear el transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Usa `true` para el puerto 465, `false` para otros puertos
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

// Función para enviar el correo
export const sendMail = async (to, subject, name, message, requestCode = null) => {
  try {
    // Generar el HTML a partir del componente React, con o sin requestCode
    const emailHtml = render(
      <templateMail name={name} requestCode={requestCode} message={message} />
    );

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
    console.log('Email has been sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Exportar la función para su uso en otras vistas
export default sendMail;
