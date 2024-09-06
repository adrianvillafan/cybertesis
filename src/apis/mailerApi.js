// Envío de correo de verificación
export const sendVerificationEmail = async (to, name, requestCode) => {
    try {
      const response = await fetch('http://localhost:3000/api/mailer/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, name, requestCode }),
      });
  
      if (!response.ok) {
        throw new Error('Error enviando el correo de verificación');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en sendVerificationEmail:', error);
      throw error;
    }
  };
  
  // Envío de correo de notificación
  export const sendNotificationEmail = async (to, name, message) => {
    try {
      const response = await fetch('http://localhost:3000/api/mailer/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, name, message }),
      });
  
      if (!response.ok) {
        throw new Error('Error enviando la notificación');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en sendNotificationEmail:', error);
      throw error;
    }
  };
  
  // Envío de correo para restablecer contraseña
  export const sendPasswordResetEmail = async (to, name, requestCode) => {
    try {
      const response = await fetch('http://localhost:3000/api/mailer/send-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, name, requestCode }),
      });
  
      if (!response.ok) {
        throw new Error('Error enviando el correo de restablecimiento de contraseña');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error en sendPasswordResetEmail:', error);
      throw error;
    }
  };
  