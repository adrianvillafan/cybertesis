import express from 'express';
import { fetchAlumnosData, fetchEscuelaUpgData } from '../queries/escuelaUpgQueries.js'

const router = express.Router();

router.get('/alumnosunidades/:escuelaId/:gradoId', (req, res) => {
  const { escuelaId , gradoId } = req.params;
  fetchAlumnosData({ escuelaId , gradoId }, (error, alumnado) => {
    if (error) {
      res.status(500).send({ message: "Error al recuperar los documentos", error: error.toString() });
    } else {
      res.json(alumnado);
    }
  });
});

router.get('/datosunidades/:userId', (req, res) => {
  const { userId } = req.params;
  fetchEscuelaUpgData(userId, (error, escuelaData) => {
    if (error) {
      res.status(500).send({ message: "Error al recuperar los datos", error: error.toString() });
    } else {
      res.json(escuelaData);
    }
  });
});

export default router;
