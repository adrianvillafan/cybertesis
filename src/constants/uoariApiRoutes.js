import { BASE_URL } from './config';

// Base URL para el manejo de usuarios y estudiantes
const USUARIOS_BASE_URL = `${BASE_URL}/uoari`;

// DATOS DE TABLA //
export const GET_ALL_UOARI_DOCUMENTS = `${USUARIOS_BASE_URL}/solicitudes_aprobadas`;
export const GET_ALL_UOARI_ABIERTO = `${USUARIOS_BASE_URL}/solicitudes_abiertas`;
export const GET_ALL_UOARI_CERRADO = `${USUARIOS_BASE_URL}/solicitudes_cerradas`;
export const GET_ALL_UOARI_EMBARGADO = `${USUARIOS_BASE_URL}/solicitudes_embargado`;

// INSERTAR DATOS //
export const SET_ALL_UOARI_INFO = `${USUARIOS_BASE_URL}/datos_incertados`;


// MOSTRAR DATOS DE FORMULARIO // // EDITAR FORMULARIO //
export const GET_ALL_UOARI_INFO = (uoariData) => `${USUARIOS_BASE_URL}/datos_formulario/${uoariData}`;
export const UPDATE_UOARI_INFO = `${USUARIOS_BASE_URL}/datos_actualizados`;

// ELIMINAR REGISTROS //
export const DELETE_UOARI_INFO = (uoariID) => `${USUARIOS_BASE_URL}/eliminar_uoari/${uoariID}`;

