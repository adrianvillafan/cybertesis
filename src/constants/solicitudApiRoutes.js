// src/constants/solicitudApiRoutes.js

import { BASE_URL } from './apiRoutes';

// Rutas específicas para solicitudes
const SOLICITUD_BASE_URL = `${BASE_URL}/solicitudes`;

export const UPDATE_DOCUMENT_STATE = `${SOLICITUD_BASE_URL}/documentos/{id}/estado`;
export const GET_DOCUMENTS_BY_STUDENT = `${SOLICITUD_BASE_URL}/documentos/tabla/upg/{facultadId}/{gradoId}/{escuelaIds}`;
export const FETCH_EXPEDIENTES = `${SOLICITUD_BASE_URL}/expedientes/{estudianteId}/{gradoId}`;
export const CREATE_SOLICITUD = `${SOLICITUD_BASE_URL}`;
export const FETCH_SOLICITUDES_BY_ALUMNO = `${SOLICITUD_BASE_URL}/{idAlumno}`;
export const FETCH_EXPEDIENTES_BY_ESTADO = `${SOLICITUD_BASE_URL}/expedientexestado/estado/{estadoId}`;
export const GET_EXPEDIENTE_DETAILS = `${SOLICITUD_BASE_URL}/expedientexestado/detalles/{solicitudId}/{expedienteId}`;
export const GET_RELATED_DOCUMENTS = `${SOLICITUD_BASE_URL}/expedientexestado/documentos/{solicitudId}/{expedienteId}`;
export const UPDATE_DOCUMENT_STATUS = `${SOLICITUD_BASE_URL}/solicitud/{solicitudId}/documento/{tipoDocumento}/estado`;
