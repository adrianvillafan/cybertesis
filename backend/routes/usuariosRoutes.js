import express from 'express';
import { fetchAlumnosData } from '../queries/escuelaUpgQueries.js'

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



export default router;
