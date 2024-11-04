// src/constants/usuariosApiRoutes.js

import { BASE_URL } from './apiRoutes';

// Base URL para el manejo de usuarios y estudiantes
const USUARIOS_BASE_URL = `${BASE_URL}/estudiantes`;

// Rutas para listar, ver, y modificar alumnado
export const GET_ALL_ALUMNOS_BY_UNIDAD = (escuelaId, gradoId) => `${USUARIOS_BASE_URL}/alumnosunidades/${escuelaId}/${gradoId}`;
export const GET_ALL_ALUMNOS_BY_PROGRAMA = (programaId) => `${USUARIOS_BASE_URL}/alumnosprogramas/${programaId}`;
export const GET_ALUMNO_DATA = (studentId) => `${USUARIOS_BASE_URL}/datosalumno/${studentId}`;
export const GET_PROGRAMAS_BY_FACULTAD = (facultadId) => `${USUARIOS_BASE_URL}/programas/${facultadId}`;
export const GET_ESCUELA_UPG_DATA = (userId) => `${USUARIOS_BASE_URL}/datosunidades/${userId}`;
export const GET_PERSONA_DATA = (tipoIdentificacionId, identificacionId) => `${USUARIOS_BASE_URL}/datospersona/${tipoIdentificacionId}/${identificacionId}`;
export const GET_ORCID_DATA = (orcid) => `${USUARIOS_BASE_URL}/datosorcid/${orcid}`;

// Rutas para los eventos relacionados con usuarios
export const GET_EVENTOS_NO_LEIDOS_TARGET = (userId, tipoUserId) => `${USUARIOS_BASE_URL}/eventos/target/no-leidos/${userId}/${tipoUserId}`;
export const GET_EVENTOS_NO_LEIDOS_ACTOR = (userId, tipoUserId) => `${USUARIOS_BASE_URL}/eventos/actor/no-leidos/${userId}/${tipoUserId}`;
export const GET_EVENTOS_TARGET = (userId, tipoUserId) => `${USUARIOS_BASE_URL}/eventos/target/${userId}/${tipoUserId}`;
export const GET_EVENTOS_ACTOR = (userId, tipoUserId) => `${USUARIOS_BASE_URL}/eventos/actor/${userId}/${tipoUserId}`;
export const GET_EVENTOS_BY_DOCUMENT = (documentId, actorTipoUserId, targetTipoUserId) => `${USUARIOS_BASE_URL}/eventos/documento/${documentId}/${actorTipoUserId}/${targetTipoUserId}`;
export const MARK_EVENTO_AS_READ = (eventId) => `${USUARIOS_BASE_URL}/eventos/read/${eventId}`;
