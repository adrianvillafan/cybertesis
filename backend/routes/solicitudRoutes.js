import express from 'express';
import { updateEstadoIdByDocumentId } from '../queries/solicitudQueries.js';
import { fetchExpedientes, createSolicitud, fetchSolicitudesByAlumno } from '../queries/studentQueries.js';
import { fetchDocumentosPorEstudiante } from '../queries/escuelaUpgQueries.js';

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

export default router;
