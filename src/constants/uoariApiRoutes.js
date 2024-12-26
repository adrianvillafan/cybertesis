import { BASE_URL } from './config';

// Base URL para el manejo de usuarios y estudiantes
const USUARIOS_BASE_URL = `${BASE_URL}/uoari`;

export const GET_ALL_UOARI_DOCUMENTS = `${USUARIOS_BASE_URL}/solicitudes_aprobadas`;
export const GET_ALL_UOARI_ABIERTO = `${USUARIOS_BASE_URL}/solicitudes_abiertas`;
export const GET_ALL_UOARI_CERRADO = `${USUARIOS_BASE_URL}/solicitudes_cerradas`;
export const GET_ALL_UOARI_EMBARGADO = `${USUARIOS_BASE_URL}/solicitudes_embargado`;
export const GET_ALL_UOARI_INFO = (solicitudId) => `${USUARIOS_BASE_URL}/documentos/${solicitudId}`;
export const SET_ALL_UOARI_INFO = `${USUARIOS_BASE_URL}/datos_incertados`;
export const UPDATE_UOARI_INFO = `${USUARIOS_BASE_URL}/datos_actualizados`;