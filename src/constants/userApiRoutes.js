// src/constants/userApiRoutes.js

import { BASE_URL } from './config';

// Rutas específicas para usuarios
const USER_BASE_URL = `${BASE_URL}/users`;

export const LOGIN = `${USER_BASE_URL}/login`;
export const LOGOUT = `${USER_BASE_URL}/logout`;
