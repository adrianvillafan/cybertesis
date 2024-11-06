// src/api/mailAPI.js

import axios from 'axios';
import {
  SEND_VERIFICATION,
  SEND_NOTIFICATION,
  SEND_PASSWORD_RESET,
} from '../constants/mailApiRoutes';

const mailAPI = {
  sendVerificationEmail: async (to, name, requestCode) => {
    const response = await axios.post(SEND_VERIFICATION, { to, name, requestCode });
    return response.data;
  },

  sendNotificationEmail: async (to, name, message) => {
    const response = await axios.post(SEND_NOTIFICATION, { to, name, message });
    return response.data;
  },

  sendPasswordResetEmail: async (to, name, requestCode) => {
    const response = await axios.post(SEND_PASSWORD_RESET, { to, name, requestCode });
    return response.data;
  },
};

export default mailAPI;
