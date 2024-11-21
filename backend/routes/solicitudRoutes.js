// backend/routes/solicitudRoutes.js

import express from 'express';
import { updateEstadoIdByDocumentId } from '../queries/solicitudQueries.js';
import { fetchExpedientes, createSolicitud, fetchSolicitudesByAlumno } from '../queries/studentQueries.js';
import { fetchDocumentosPorEstudiante, fetchSolicitudesObservadasPorFacultadYGrado } from '../queries/escuelaUpgQueries.js';
import { fetchExpedientesByEstado, fetchExpedienteDetails, fetchDocumentosRelacionados, updateEstadoDocumento, updateEstadoExpediente } from '../queries/recepDocsQueries.js';

const router = express.Router();

// Ruta para actualizar el estado_id en la tabla de documentos
router.put('/documentos/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estadoId } = req.body;

  updateEstadoIdByDocumentId(id, estadoId, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al actualizar el estado_id', error: error.message });
    } else {
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    }
  });
});

// Nueva ruta para obtener documentos por estudiante, facultad, grado, y escuelas
router.get('/documentos/tabla/upg/:facultadId/:gradoId/:escuelaIds', (req, res) => {
  const { facultadId, gradoId, escuelaIds } = req.params;

  // Convierte escuelaIds a un array si no lo es
  const escuelaIdsArray = Array.isArray(escuelaIds) ? escuelaIds : escuelaIds.split(',');

  fetchDocumentosPorEstudiante({ facultadId, gradoId, escuelaIds: escuelaIdsArray }, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener documentos por estudiante', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Nueva ruta para obtener solicitudes observadas por facultad y grado
router.get('/observadas/:facultadId/:gradoId', (req, res) => {
  const { facultadId, gradoId } = req.params;

  fetchSolicitudesObservadasPorFacultadYGrado(facultadId, gradoId, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener solicitudes observadas por facultad y grado', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Ruta para obtener expedientes por estudiante
router.get('/expedientes/:estudianteId/:gradoId', (req, res) => {
  const { estudianteId, gradoId } = req.params;

  fetchExpedientes(estudianteId, gradoId, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener expedientes', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Ruta para crear una solicitud y actualizar el documento
router.post('/solicitudes', (req, res) => {
  const { idFacultad, idDocumento } = req.body;

  createSolicitud(idFacultad, idDocumento, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error al crear la solicitud', error: err.message });
    } else {
      res.status(201).json({ message: 'Solicitud creada y documento actualizado', result });
    }
  });
});

// Nueva ruta para obtener solicitudes por alumno
router.get('/solicitudes/:idAlumno', (req, res) => {
  const { idAlumno } = req.params;

  fetchSolicitudesByAlumno(idAlumno, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener solicitudes', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Nueva ruta para obtener expedientes por estado
router.get('/expedientexestado/estado/:estadoId', (req, res) => {
  const { estadoId } = req.params;

  fetchExpedientesByEstado(estadoId, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener expedientes por estado', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Nueva ruta para obtener detalles de un expediente
router.get('/expedientexestado/detalles/:solicitudId/:expedienteId', (req, res) => {
  const { solicitudId, expedienteId } = req.params;

  fetchExpedienteDetails(solicitudId, expedienteId, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener detalles del expediente', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Nueva ruta para obtener documentos relacionados de un expediente
router.get('/expedientexestado/documentos/:solicitudId/:expedienteId', (req, res) => {
  const { solicitudId, expedienteId } = req.params;

  fetchDocumentosRelacionados(solicitudId, expedienteId, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al obtener documentos relacionados', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// Nueva ruta para actualizar el estado de un documento específico
router.put('/solicitud/:solicitudId/documento/:tipoDocumento/estado', (req, res) => {
  const { solicitudId, tipoDocumento } = req.params;
  const { estado, motivoObservacion, comentariosRevision, revisorId } = req.body;

  updateEstadoDocumento(solicitudId, tipoDocumento, estado, motivoObservacion, comentariosRevision, revisorId, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al actualizar el estado del documento', error: err.message });
    } else {
      res.status(200).json({ message: 'Estado del documento actualizado correctamente', results });
    }
  });
});

// Nueva ruta para actualizar el estado del expediente
router.put('/solicitud/:solicitudId/estado', (req, res) => {
  const { solicitudId } = req.params;
  const { nuevoEstado } = req.body;

  // Llamada a la función updateEstadoExpediente para actualizar el estado
  updateEstadoExpediente(solicitudId, nuevoEstado, (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error al actualizar el estado del expediente', error: err.message });
    } else {
      res.status(200).json({ message: 'Estado del expediente actualizado correctamente', results });
    }
  });
});

export default router;
