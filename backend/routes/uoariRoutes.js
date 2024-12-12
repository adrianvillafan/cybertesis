import express from 'express';
import { uoariData, listUoariData } from '../queries/uoariQueries.js';


const router = express.Router();

// Ruta para actualizar el estado_id en la tabla de documentos
router.get('/uoari/:dataId', (req, res) => {
  const { dataId } = req.params;

  listUoariData(dataId, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al listar la informacion', error: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get('/uoari/datos/:solicitudId', (req, res) => {
    const { solicitudId } = req.params;
  
    uoariData(solicitudId, (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error al listar la informacion', error: error.message });
      } else {
        res.status(200).json(results);
      }
    });
  });


export default router;