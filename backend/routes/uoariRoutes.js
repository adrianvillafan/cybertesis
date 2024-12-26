import express from 'express';
import { listUoariData, listAbiertoUoariData, listCerradoUoariData, listEmbargoUoariData, 
          insertUoari, updateUoari } from '../queries/uoariQueries.js';


const router = express.Router();

// Ruta para actualizar el estado_id en la tabla de documentos
router.get('/solicitudes_aprobadas', (req, res) => {
  listUoariData((error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al listar la información', error: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get('/solicitudes_abiertas', (req, res) => {
  listAbiertoUoariData((error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al listar la información', error: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});


router.get('/solicitudes_cerradas', (req, res) => {
  listCerradoUoariData((error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al listar la información', error: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});


router.get('/solicitudes_embargado', (req, res) => {
  listEmbargoUoariData((error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al listar la información', error: error.message });
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


router.post('/datos_incertados', (req, res) => {
  const uoariDetails = req.body; // Los datos para insertar deben venir en el cuerpo de la solicitud
  
  insertUoari(uoariDetails, (error, uoariId) => {
    if (error) {
      res.status(500).json({
        message: 'Error al insertar la información en uoari',
        error: error.message
      });
    } else {
      res.status(200).json({
        message: 'Inserción exitosa',
        id: uoariId // Devuelve el ID del registro insertado
      });
    }
  });
});

router.put('/datos_actualizados', (req, res) => {
  const uoariDetails = req.body;

  updateUoari(uoariDetails, (error, uoariId) => {
    if (error) {
      res.status(500).json({
        message: 'Error al actualizar la información en uoari',
        error: error.message,
      });
    } else {
      res.status(200).json({
        message: 'Actualización exitosa',
        id: uoariId,
      });
    }
  });
});

export default router;