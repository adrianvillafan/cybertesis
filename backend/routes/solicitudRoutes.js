import express from 'express';
import { createSolicitud, updateEstadoIdByDocumentId } from '../queries/solicitudQueries.js';

const router = express.Router();

router.post('/create', (req, res) => {
  const { estudianteId, tipoSolicitudId, estadoId } = req.body;
  createSolicitud({
    estudianteId: estudianteId,
    tipoSolicitudId: tipoSolicitudId,
    estadoId: estadoId || 3, // Estado por defecto si no se proporciona
    fechaRegistro: new Date() // Fecha actual
  }, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error al crear la solicitud", error: err.message });
    } else {
      res.status(201).send({ solicitudId: result.insertId });
    }
  });
});

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



export default router;
