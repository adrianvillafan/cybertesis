import express from 'express';
import multer from 'multer';
import { uploadFileToMinIO, getDownloadUrlFromMinIO, deleteFileFromMinIO, getViewUrlForDocument } from '../minio/controllers/minioController.js';
import { createOrFetchDocumentos } from '../queries/documentQueries.js';
import { insertTesis, updateTesis, deleteTesisById, getTesisById, getTesisByStudentId } from '../queries/tesisQueries.js';
import { getSolicitudesByEstudianteId } from '../queries/solicitudQueries.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Límite de 10 MB

const BUCKETS = {
  TESIS: process.env.TESIS_BUCKET_NAME,
  ACTAS: process.env.ACTAS_BUCKET_NAME,
  CERTIFICADOS: process.env.CERTIFICADOS_BUCKET_NAME,
  CYBER: process.env.CYBER_BUCKET_NAME,
  METADATOS: process.env.METADATOS_BUCKET_NAME,
  TURNITIN: process.env.TURNITIN_BUCKET_NAME
};

// Functions for file upload, download, view, and delete based on document type
const getBucketName = (type) => BUCKETS[type.toUpperCase()] || BUCKETS.TESIS;

// ------------------ File Upload Routes ------------------

router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  const { type, fileName } = req.body;

  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  try {
    const bucketName = getBucketName(type);
    const uploadResult = await uploadFileToMinIO(file, bucketName, fileName);
    res.json({ message: uploadResult });
  } catch (error) {
    res.status(500).send('Error al subir el archivo: ' + error.message);
  }
});

router.get('/download/:type/:filename', async (req, res) => {
  const { type, filename } = req.params;

  try {
    const bucketName = getBucketName(type);
    const downloadUrl = await getDownloadUrlFromMinIO(bucketName, filename);
    res.send({ downloadUrl });
  } catch (error) {
    res.status(500).send('Error al obtener el link de descarga: ' + error.message);
  }
});

router.get('/view/:type/:filename', async (req, res) => {
  const { type, filename } = req.params;

  try {
    const bucketName = getBucketName(type);
    const blob = await getViewUrlForDocument(bucketName, filename);
    res.send(blob);
  } catch (error) {
    res.status(500).send('Error al obtener el blob del documento:' + error.message);
  }
});

router.delete('/delete/:type/:filename', async (req, res) => {
  const { type, filename } = req.params;

  try {
    const bucketName = getBucketName(type);
    await deleteFileFromMinIO(bucketName, filename);
    await deleteDocumentByFilename(filename);
    res.send({ message: 'Archivo y registro eliminados exitosamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar el archivo y el registro: ' + error.message);
  }
});

// ------------------ Tesis Routes ------------------

router.post('/tesis/insert', async (req, res) => {
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

router.put('/tesis/update/:id', async (req, res) => {
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

router.delete('/tesis/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tesis = await getTesisById(id);
    if (!tesis) {
      return res.status(404).send('Tesis no encontrada.');
    }

    await deleteFileFromMinIO(BUCKETS.TESIS, tesis.file_url);
    await deleteTesisById(id);

    res.json({ message: 'Tesis eliminada correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar tesis: ' + error.message);
  }
});

router.get('/tesis/:id', async (req, res) => {
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

router.get('/tesis/student/:studentId', async (req, res) => {
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

// ------------------ Document Handling Routes ------------------

router.post('/create-or-fetch', (req, res) => {
  const { gradeId, studentId, userId } = req.body;
  createOrFetchDocumentos(gradeId, studentId, userId, (error, documentos) => {
    if (error) {
      console.error('Error al crear o recuperar documentos:', error);
      res.status(500).json({ message: 'Error al crear o recuperar documentos', error: error.toString() });
    } else {
      res.json(documentos);
    }
  });
});

// Endpoint para obtener las solicitudes de un estudiante por su ID
router.get('/solicitudes/:estudianteId', (req, res) => {
  const { estudianteId } = req.params;
  getSolicitudesByEstudianteId(estudianteId, (err, solicitudes) => {
    if (err) {
      res.status(500).send('Error al consultar las solicitudes del estudiante');
    } else {
      res.json(solicitudes);
    }
  });
});



export default router;
