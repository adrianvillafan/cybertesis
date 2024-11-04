// src/constants/userApiRoutes.js

import { BASE_URL } from './apiRoutes';

// Rutas específicas para usuarios
const USER_BASE_URL = `${BASE_URL}/users`;

export const LOGIN_USER = `${USER_BASE_URL}/login`;
export const LOGOUT_USER = `${USER_BASE_URL}/logout`;
