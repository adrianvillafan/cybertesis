import express from 'express';
import { createSolicitud } from '../queries/studentQueries.js'; // Asegúrate de tener esta función definida

const router = express.Router();

router.post('/create', (req, res) => {
  const { estudianteId, tipoSolicitudId, estadoId } = req.body;
  createSolicitud({
    estudianteId: estudianteId,
    tipoSolicitudId: tipoSolicitudId,
    estadoId: estadoId || 1, // Estado por defecto si no se proporciona
    fechaRegistro: new Date() // Fecha actual
  }, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Error al crear la solicitud", error: err.message });
    } else {
      res.status(201).send({ solicitudId: result.insertId });
    }
  });
});

export default router;