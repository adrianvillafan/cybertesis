import { BASE_URL } from './config';

// Base URL para el manejo de usuarios y estudiantes
const USUARIOS_BASE_URL = `${BASE_URL}/uoari`;

export const GET_ALL_UOARI_DOCUMENTS = `${USUARIOS_BASE_URL}/solicitudes_aprobadas`;
export const GET_ALL_UOARI_INFO = (solicitudId) => `${USUARIOS_BASE_URL}/documentos/${solicitudId}`;