// src/constants/fileApiRoutes.js

import { BASE_URL } from './config';

// Rutas específicas para manejo de archivos
const FILE_BASE_URL = `${BASE_URL}/files`;

export const UPLOAD_FILE = `${FILE_BASE_URL}/upload`;
export const DOWNLOAD_FILE = `${FILE_BASE_URL}/download/{type}/{filename}`;
export const VIEW_FILE = `${FILE_BASE_URL}/view/{type}/{filename}`;
export const DELETE_FILE = `${FILE_BASE_URL}/delete/{type}/{filename}`;

// Rutas adicionales para manejar tesis, actas, etc.
export const INSERT_TESIS = `${FILE_BASE_URL}/tesis/insert`;
export const DELETE_TESIS = `${FILE_BASE_URL}/tesis/delete/{id}`;
export const GET_TESIS = `${FILE_BASE_URL}/tesis/{id}`;
export const GET_TESIS_BY_STUDENT = `${FILE_BASE_URL}/tesis/student/{studentId}`;

// Rutas para Actas de Sustentación
export const INSERT_ACTA = `${FILE_BASE_URL}/acta/insert`;
export const DELETE_ACTA = `${FILE_BASE_URL}/acta/delete/{id}`;
export const GET_ACTA = `${FILE_BASE_URL}/acta/{id}`;

// Rutas para Metadatos
export const INSERT_METADATA = `${FILE_BASE_URL}/metadata/insert`;
export const DELETE_METADATA = `${FILE_BASE_URL}/metadata/delete/{id}`;
export const GET_METADATA = `${FILE_BASE_URL}/metadata/{id}`;
export const GET_LINEAS_INVESTIGACION = `${FILE_BASE_URL}/lineas-investigacion/{facultadId}`;
export const GET_GRUPOS_INVESTIGACION = `${FILE_BASE_URL}/grupos-investigacion/{facultadId}`;
export const GET_DISCIPLINAS_OCDE = `${FILE_BASE_URL}/disciplinas-ocde`;

// Rutas para Certificados de Similitud
export const INSERT_CERTIFICADO = `${FILE_BASE_URL}/certificado/insert`;
export const DELETE_CERTIFICADO = `${FILE_BASE_URL}/certificado/delete/{id}`;
export const GET_CERTIFICADO = `${FILE_BASE_URL}/certificado/{id}`;

// Rutas para AutoCyber
export const INSERT_AUTOCYBER = `${FILE_BASE_URL}/autocyber/insert`;
export const DELETE_AUTOCYBER = `${FILE_BASE_URL}/autocyber/delete/{id}`;
export const GET_AUTOCYBER = `${FILE_BASE_URL}/autocyber/{id}`;

// Rutas para Reporte Turnitin
export const INSERT_REPORTE_TURNITIN = `${FILE_BASE_URL}/reporte-turnitin/insert`;
export const DELETE_REPORTE_TURNITIN = `${FILE_BASE_URL}/reporte-turnitin/delete/{id}`;
export const GET_REPORTE_TURNITIN = `${FILE_BASE_URL}/reporte-turnitin/{id}`;

// Rutas para Postergación de Publicación
export const INSERT_POSTERGACION = `${FILE_BASE_URL}/postergacion/insert`;
export const DELETE_POSTERGACION = `${FILE_BASE_URL}/postergacion/delete/{id}`;
export const GET_POSTERGACION = `${FILE_BASE_URL}/postergacion/{id}`;

// Rutas para Consentimiento Informado
export const INSERT_CONSENTIMIENTO = `${FILE_BASE_URL}/consentimiento/insert`;
export const DELETE_CONSENTIMIENTO = `${FILE_BASE_URL}/consentimiento/delete/{id}`;
export const GET_CONSENTIMIENTO = `${FILE_BASE_URL}/consentimiento/{id}`;

// Rutas adicionales para manejo de documentos
export const CREATE_OR_FETCH_DOCUMENTOS = `${FILE_BASE_URL}/create-or-fetch`;
export const GET_SOLICITUDES_BY_ESTUDIANTE = `${FILE_BASE_URL}/solicitudes/{estudianteId}`;

