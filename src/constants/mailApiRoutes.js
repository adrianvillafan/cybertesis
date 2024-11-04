// src/constants/mailApiRoutes.js

import { BASE_URL } from './apiRoutes';

// Rutas para correos electrónicos
const MAIL_BASE_URL = `${BASE_URL}/mailer`;

export const SEND_VERIFICATION = `${MAIL_BASE_URL}/send-verification`;
export const SEND_NOTIFICATION = `${MAIL_BASE_URL}/send-notification`;
export const SEND_PASSWORD_RESET = `${MAIL_BASE_URL}/send-password-reset`;
