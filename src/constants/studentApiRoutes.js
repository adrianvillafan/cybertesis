// src/constants/studentApiRoutes.js

import { BASE_URL } from './config';

// Rutas específicas para estudiantes
const STUDENT_BASE_URL = `${BASE_URL}/estudiantes`;
const SOLICITUD_BASE_URL = `${BASE_URL}/solicitudes`;

export const GET_DATOS_BY_DNI = `${STUDENT_BASE_URL}/datospersona/{tipoIdentificacionId}/{identificacionId}`;
export const GET_DATOS_ORCID = `${STUDENT_BASE_URL}/datosorcid/{orcid}`;
export const GET_EXPEDIENTES = `${SOLICITUD_BASE_URL}/expedientes/{estudianteId}/{gradoId}`;
export const CREATE_SOLICITUD = `${SOLICITUD_BASE_URL}/solicitudes`;
export const GET_SOLICITUDES_BY_ALUMNO = `${SOLICITUD_BASE_URL}/solicitudes/{idAlumno}`;