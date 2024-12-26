import express from 'express';
import { listUoariData, listAbiertoUoariData, listCerradoUoariData, listEmbargoUoariData, 
          insertUoari, 
          formUoariData, updateUoari, 
          deleteUoariBySolicitudId } from '../queries/uoariQueries.js';

const router = express.Router();

// LISTA DE TABLA PRICIPAL //
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


// INSERTAR DATOS //
router.post('/datos_incertados', (req, res) => {
  const uoariDetails = req.body; // Los datos para insertar deben venir en el cuerpo de la solicitud

  insertUoari(uoariDetails, (error, uoariId) => {
    if (error) {
      res.status(500).json({
        message: 'Error al insertar la información en uoari',
        error: error.message,
      });
    } else {
      res.status(200).json({
        message: 'Inserción exitosa',
        id: uoariId, // Devuelve el ID del registro insertado
      });
    }
  });
});



// INSERTAR DATOS //
router.post('/datos_incertados', (req, res) => {
  const uoariDetails = req.body; // Los datos para insertar deben venir en el cuerpo de la solicitud

  insertUoari(uoariDetails, (error, uoariId) => {
    if (error) {
      res.status(500).json({
        message: 'Error al insertar la información en uoari',
        error: error.message,
      });
    } else {
      res.status(200).json({
        message: 'Inserción exitosa',
        id: uoariId, // Devuelve el ID del registro insertado
      });
    }
  });
});


//MOSTRAR DATOS DEL FORMULARIO // // ACTUALIZAR DATOS DEL FORMULARIO //
router.get('/datos_formulario/:uoariData', (req, res) => {
  const  {uoariData} = req.params;

  formUoariData(uoariData, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al listar la información', error: error.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.patch('/datos_actualizados', (req, res) => {
  const uoariDetails = req.body; // Aquí esperamos que req.body contenga directamente los datos de uoari

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



// ELIMINAR REGISTROS // 
router.delete('/eliminar_uoari/:uoariID', (req, res) => {
  const  {uoariID} = req.params;

  deleteUoariBySolicitudId(uoariID, (error, rowCount) => {
    if (error) {
      res.status(500).json({
        message: 'Error al eliminar la información en uoari',
        error: error.message,
      });
    } else if (rowCount === 0) {
      res.status(404).json({
        message: 'No se encontró un registro con el solicitud_id proporcionado',
      });
    } else {
      res.status(200).json({
        message: 'Eliminación exitosa',
        filas_eliminadas: rowCount, // Devuelve el número de filas eliminadas
      });
    }
  });
});

export default router;
