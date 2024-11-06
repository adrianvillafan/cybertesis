// src/services/mailService.js

import mailAPI from '../api/mailAPI';

const mailService = {
  sendVerificationEmail: async (to, name, requestCode) => {
    try {
      return await mailAPI.sendVerificationEmail(to, name, requestCode);
    } catch (error) {
      console.error('Error enviando correo de verificación:', error);
      throw error;
    }
  },

  sendNotificationEmail: async (to, name, message) => {
    try {
      return await mailAPI.sendNotificationEmail(to, name, message);
    } catch (error) {
      console.error('Error enviando notificación:', error);
      throw error;
    }
  },

  sendPasswordResetEmail: async (to, name, requestCode) => {
    try {
      return await mailAPI.sendPasswordResetEmail(to, name, requestCode);
    } catch (error) {
      console.error('Error enviando correo de restablecimiento de contraseña:', error);
      throw error;
    }
  },
};

export default mailService;
