import express from 'express';
import { sendMail } from '../mailer/sendMail.jsx';

const router = express.Router();

// Ruta para enviar un correo de verificación con un código
router.post('/send-verification', async (req, res) => {
  const { to, name, requestCode } = req.body;
  const subject = 'Verificación de Cuenta';
  const message = 'Por favor, utiliza el siguiente código para verificar tu cuenta:';

  try {
    await sendMail(to, subject, name, message, requestCode);
    res.status(200).send('Verification email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending verification email');
  }
});

// Ruta para enviar un correo de notificación simple
router.post('/send-notification', async (req, res) => {
  const { to, name, message } = req.body;
  const subject = 'Notificación Importante';

  try {
    await sendMail(to, subject, name, message);
    res.status(200).send('Notification email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending notification email');
  }
});

// Ruta para enviar un correo de restablecimiento de contraseña con un código
router.post('/send-password-reset', async (req, res) => {
  const { to, name, requestCode } = req.body;
  const subject = 'Restablecimiento de Contraseña';
  const message = 'Por favor, utiliza el siguiente código para restablecer tu contraseña:';

  try {
    await sendMail(to, subject, name, message, requestCode);
    res.status(200).send('Password reset email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending password reset email');
  }
});

export default router;
