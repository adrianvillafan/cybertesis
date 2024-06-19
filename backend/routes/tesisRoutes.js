import express from 'express';
import {
  insertTesis,
  updateTesis,
  deleteTesisById,
  getTesisById,
  getTesisByStudentId,
  updateDocumentosEstado,
} from '../queries/tesisQueries.js';
import { uploadFileToMinIO, deleteFileFromMinIO, getDownloadUrlFromMinIO } from '../minio/controllers/minioController.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Límite de 10 MB

const BUCKET_NAME = process.env.BUCKET_NAME;

// Ruta para subir archivo de tesis
router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  const { fileName } = req.body;

  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  try {
    const uploadResult = await uploadFileToMinIO(file, BUCKET_NAME, fileName);
    res.json({ message: uploadResult });
  } catch (error) {
    res.status(500).send('Error al subir el archivo de tesis: ' + error.message);
  }
});

// Ruta para insertar detalles de tesis
router.post('/insert', async (req, res) => {
  const tesisDetails = req.body;

  try {
    insertTesis(tesisDetails, (err, tesisId) => {
      if (err) {
        res.status(500).send('Error al insertar tesis: ' + err.message);
      } else {
        res.json({ message: 'Tesis insertada correctamente', tesisId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar tesis: ' + error.message);
  }
});

// Ruta para actualizar detalles de tesis
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const tesisDetails = req.body;

  try {
    updateTesis(id, tesisDetails, (err, result) => {
      if (err) {
        res.status(500).send('Error al actualizar tesis: ' + err.message);
      } else {
        res.json({ message: 'Tesis actualizada correctamente' });
      }
    });
  } catch (error) {
    res.status(500).send('Error al actualizar tesis: ' + error.message);
  }
});

// Ruta para eliminar archivo de tesis
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tesis = await getTesisById(id);
    if (!tesis) {
      return res.status(404).send('Tesis no encontrada.');
    }

    await deleteFileFromMinIO(BUCKET_NAME, tesis.file_url);
    await deleteTesisById(id);

    res.json({ message: 'Tesis eliminada correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar tesis: ' + error.message);
  }
});

// Ruta para obtener detalles de tesis por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    getTesisById(id, (err, tesis) => {
      if (err) {
        res.status(500).send('Error al obtener detalles de tesis: ' + err.message);
      } else if (!tesis) {
        res.status(404).send('Tesis no encontrada.');
      } else {
        res.json(tesis);
      }
    });
  } catch (error) {
    res.status(500).send('Error al obtener detalles de tesis: ' + error.message);
  }
});

// Ruta para obtener las tesis de un estudiante por su ID
router.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    getTesisByStudentId(studentId, (err, tesisList) => {
      if (err) {
        res.status(500).send('Error al obtener las tesis del estudiante: ' + err.message);
      } else {
        res.json(tesisList);
      }
    });
  } catch (error) {
    res.status(500).send('Error al obtener las tesis del estudiante: ' + error.message);
  }
});

// Ruta para actualizar el estado de los documentos
router.put('/submit/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    updateDocumentosEstado(studentId, (err, result) => {
      if (err) {
        res.status(500).send('Error al actualizar el estado de los documentos: ' + err.message);
      } else {
        res.json({ message: 'Estado de los documentos actualizado correctamente' });
      }
    });
  } catch (error) {
    res.status(500).send('Error al actualizar el estado de los documentos: ' + error.message);
  }
});

export default router;
